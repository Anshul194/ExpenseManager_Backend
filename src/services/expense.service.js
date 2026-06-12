import Expense from "../models/Expense.js";
import Category from "../models/Category.js";
import { ApiError } from "../utils/ApiError.js";

export const createExpenseService = async (userId, data) => {
    try {
        const cat = await Category.findOne({ _id: data.categoryId, userId });

        if (!cat) {
            throw new ApiError(404, "Category not found");
        }

        const expense = await Expense.create({ userId, ...data });

        return expense.populate("categoryId", "name color");
    } catch (err) {
        throw err;
    }
};

export const getExpensesService = async (userId, query) => {
    try {
        const { categoryId, startDate, endDate, minAmount, maxAmount, paymentMethod,
            search, page = 1, limit = 10, sortBy = "expenseDate", order = "desc", } = query;

        const filter = { userId };

        if (categoryId) filter.categoryId = categoryId;
        if (paymentMethod) filter.paymentMethod = paymentMethod;

        if (startDate || endDate) {
            filter.expenseDate = {};

            if (startDate) filter.expenseDate.$gte = new Date(startDate);
            if (endDate) filter.expenseDate.$lte = new Date(endDate);
        }

        if (minAmount || maxAmount) {
            filter.amount = {};

            if (minAmount) filter.amount.$gte = parseFloat(minAmount);
            if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
        }

        if (search) {
            filter.$text = { $search: search };
        }

        const pageNum = parseInt(page);
        const limitNum = Math.min(parseInt(limit), 100);

        const skip = (pageNum - 1) * limitNum;

        const [expenses, total] = await Promise.all([
            Expense.find(filter)
                .populate("categoryId", "name color")
                .sort({ [sortBy]: order === "asc" ? 1 : -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),

            Expense.countDocuments(filter),
        ]);

        return {
            expenses,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1,
            },
        };
    } catch (err) {
        throw err;
    }
};

export const getExpenseByIdService = async (userId, id) => {
    try {
        const expense = await Expense.findOne({
            _id: id,
            userId
        }).populate("categoryId", "name color");

        if (!expense) throw new ApiError(404, "Expense not found");

        return expense;
    } catch (err) {
        throw err;
    }
};

export const updateExpenseService = async (userId, id, data) => {
    try {
        if (data.categoryId) {
            const cat = await Category.findOne({ _id: data.categoryId, userId });

            if (!cat) throw new ApiError(404, "Category not found");
        }

        const expense = await Expense.findOneAndUpdate(
            { _id: id, userId },
            { $set: data },
            { new: true, runValidators: true }
        ).populate("categoryId", "name color");

        if (!expense) throw new ApiError(404, "Expense not found");

        return expense;

    } catch (err) {
        throw err;
    }
};

export const deleteExpenseService = async (userId, id) => {
    try {
        const deleted = await Expense.findOneAndDelete({
            _id: id,
            userId
        });

        if (!deleted) throw new ApiError(404, "Expense not found");

    } catch (err) {
        throw err;
    }
};