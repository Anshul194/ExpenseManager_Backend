import { Router } from "express";
import {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
} from "../controllers/expense.controller.js";
import {
    createExpenseValidation,
    updateExpenseValidation,
    expenseIdValidation,
    getExpensesQueryValidation,
} from "../validations/expense.validation.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", createExpenseValidation, validate, createExpense);
router.get("/", getExpensesQueryValidation, validate, getExpenses);
router.get("/:id", expenseIdValidation, validate, getExpenseById);
router.put("/:id", updateExpenseValidation, validate, updateExpense);
router.delete("/:id", expenseIdValidation, validate, deleteExpense);

export default router;
