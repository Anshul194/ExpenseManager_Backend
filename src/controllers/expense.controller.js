import {
    createExpenseService,
    getExpensesService,
    getExpenseByIdService,
    updateExpenseService,
    deleteExpenseService,
} from "../services/expense.service.js";

export const createExpense = async (req, res) => {
    try {
        const expense = await createExpenseService(req.user._id, req.body);
        return res.status(201).json({
            success: true,
            message: "Expense added",
            data: { expense },
        });
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getExpenses = async (req, res) => {
    try {
        const result = await getExpensesService(req.user._id, req.query);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Failed to get expenses",
        });
    }
};

export const getExpenseById = async (req, res) => {
    try {
        const expense = await getExpenseByIdService(req.user._id, req.params.id);
        return res.status(200).json({ success: true, data: { expense } });
    } catch (err) {
        return res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
};

export const updateExpense = async (req, res) => {
    try {
        const expense = await updateExpenseService(req.user._id, req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Expense updated",
            data: { expense },
        });
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
        });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        await deleteExpenseService(req.user._id, req.params.id);
        return res.status(200).json({ success: true, message: "Expense deleted" });
    } catch (err) {
        return res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
};
