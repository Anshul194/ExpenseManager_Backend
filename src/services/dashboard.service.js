import Expense from "../models/Expense.js";
import Category from "../models/Category.js";

const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return { start, end };
};

export const getDashboardSummaryService = async (userId) => {
    try {
        const { start, end } = getCurrentMonthRange();

        const [result] = await Expense.aggregate([
            { $match: { userId, expenseDate: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: null,
                    totalSpending: { $sum: "$amount" },
                    expenseCount: { $sum: 1 },
                },
            },
        ]);

        const totalSpending = result?.totalSpending ?? 0;
        const expenseCount = result?.expenseCount ?? 0;

        const daysPassed = new Date().getDate();
        const daysInMonth = new Date(
            end.getFullYear(),
            end.getMonth() + 1,
            0
        ).getDate();

        return {
            currentMonthTotalSpending: parseFloat(totalSpending.toFixed(2)),
            currentMonthExpenseCount: expenseCount,
            averageDailySpending: parseFloat(
                (totalSpending / daysPassed).toFixed(2)
            ),
            daysTracked: daysPassed,
            totalDaysInMonth: daysInMonth,
        };

    } catch (err) {
        throw new Error("Failed to get summary: " + err.message);
    }
};

export const getCategoryBreakdownService = async (userId) => {
    try {
        const { start, end } = getCurrentMonthRange();

        const breakdown = await Expense.aggregate([
            { $match: { userId, expenseDate: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: "$categoryId",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$category" },
            {
                $project: {
                    _id: 0,
                    categoryId: "$_id",
                    name: "$category.name",
                    color: "$category.color",
                    totalAmount: { $round: ["$totalAmount", 2] },
                    count: 1,
                },
            },
            { $sort: { totalAmount: -1 } },
        ]);

        const grandTotal = breakdown.reduce((acc, b) => acc + b.totalAmount, 0);

        return breakdown.map((b) => ({
            ...b,
            percentage:
                grandTotal > 0
                    ? parseFloat(
                        ((b.totalAmount / grandTotal) * 100).toFixed(1)
                    )
                    : 0,
        }));

    } catch (err) {
        throw new Error("Failed to get category breakdown: " + err.message);
    }
};

export const getSpendingTrendsService = async (userId) => {
    try {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const trend = await Expense.aggregate([
            {
                $match: {
                    userId,
                    expenseDate: {
                        $gte: sevenDaysAgo,
                        $lte: today,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$expenseDate" },
                        month: { $month: "$expenseDate" },
                        day: { $dayOfMonth: "$expenseDate" },
                    },
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                    "_id.day": 1,
                },
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                                $dateFromParts: {
                                    year: "$_id.year",
                                    month: "$_id.month",
                                    day: "$_id.day",
                                },
                            },
                        },
                    },
                    totalAmount: { $round: ["$totalAmount", 2] },
                    count: 1,
                },
            },
        ]);

        const trendMap = new Map(
            trend.map((t) => [t.date, t])
        );

        const result = [];

        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);

            d.setDate(d.getDate() + i);

            const key = d.toISOString().split("T")[0];

            result.push(
                trendMap.get(key) || {
                    date: key,
                    totalAmount: 0,
                    count: 0,
                }
            );
        }

        return result;

    } catch (err) {
        throw new Error("Failed to get spending trends: " + err.message);
    }
};

export const getBudgetStatusService = async (userId) => {
    try {
        const { start, end } = getCurrentMonthRange();

        const categories = await Category.find({
            userId,
            monthlyBudget: { $gt: 0 },
        }).lean();

        const spending = await Expense.aggregate([
            { $match: { userId, expenseDate: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: "$categoryId",
                    spent: { $sum: "$amount" },
                },
            },
        ]);

        const spendingMap = new Map(spending.map((s) => [
            s._id.toString(),
            s.spent
        ]));

        return categories.map((cat) => {
            const spent = spendingMap.get(cat._id.toString()) ?? 0;

            const remaining = cat.monthlyBudget - spent;

            return {
                categoryId: cat._id,
                name: cat.name,
                color: cat.color,
                budget: cat.monthlyBudget,
                spent: parseFloat(spent.toFixed(2)),
                remaining: parseFloat(remaining.toFixed(2)),
                usagePercent: parseFloat(
                    ((spent / cat.monthlyBudget) * 100).toFixed(1)
                ),
                exceeded: spent > cat.monthlyBudget,
            };
        });

    } catch (err) {
        throw new Error("Failed to get budget status: " + err.message);
    }
};

export const getTopExpensesService = async (userId, topN = 5) => {
    try {
        const { start, end } = getCurrentMonthRange();

        const expenses = await Expense.find({
            userId,
            expenseDate: {
                $gte: start,
                $lte: end,
            },
        })
            .populate("categoryId", "name color")
            .sort({ amount: -1 })
            .limit(parseInt(topN))
            .lean();

        return expenses;

    } catch (err) {
        throw new Error("Failed to get top expenses: " + err.message);
    }
};