import {
    getDashboardSummaryService,
    getCategoryBreakdownService,
    getSpendingTrendsService,
    getBudgetStatusService,
    getTopExpensesService
} from "../services/dashboard.service.js";

export const getSummary = async (req, res) => {
    try {
        const summary = await getDashboardSummaryService(req.user._id);

        res.json({
            success: true,
            data: summary
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to load summary"
        });
    }
};

export const getCategoryBreakdown = async (req, res) => {
    try {

        const breakdown = await getCategoryBreakdownService(req.user._id);

        return res.json({
            success: true,
            breakdown
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getSpendingTrends = async (req, res) => {
    try {
        const trends = await getSpendingTrendsService(req.user._id);

        res.json({
            success: true,
            data: trends
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Could not load trends"
        });
    }
};

export const getBudgetStatus = async (req, res) => {
    try {
        const budgetStatus = await getBudgetStatusService(req.user._id);

        res.json({
            success: true,
            data: budgetStatus
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

export const getTopExpenses = async (req, res) => {
    try {
        let top = parseInt(req.query.top);

        if (!top) top = 5;

        const expenses = await getTopExpensesService(
            req.user._id,
            top
        );

        res.json({
            success: true,
            data: expenses
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};