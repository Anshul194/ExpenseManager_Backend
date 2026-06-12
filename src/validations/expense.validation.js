import { body, param, query } from "express-validator";
import { PAYMENT_METHODS } from "../constants/index.js";

export const createExpenseValidation = [
    body("categoryId")
        .notEmpty().withMessage("Category ID is required")
        .isMongoId().withMessage("Invalid category ID"),

    body("amount")
        .notEmpty().withMessage("Amount is required")
        .isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),

    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ max: 200 }).withMessage("Title must be at most 200 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage("Description must be at most 1000 characters"),

    body("paymentMethod")
        .optional()
        .isIn(PAYMENT_METHODS)
        .withMessage(`Payment method must be one of: ${PAYMENT_METHODS.join(", ")}`),

    body("expenseDate")
        .optional()
        .isISO8601().withMessage("Expense date must be a valid ISO 8601 date"),

    body("tags")
        .optional()
        .isArray().withMessage("Tags must be an array"),

    body("receiptUrl")
        .optional()
        .isURL().withMessage("Receipt URL must be a valid URL"),
];

export const updateExpenseValidation = [
    param("id")
        .isMongoId().withMessage("Invalid expense ID"),

    body("categoryId")
        .optional()
        .isMongoId().withMessage("Invalid category ID"),

    body("amount")
        .optional()
        .isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),

    body("title")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("Title must be at most 200 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage("Description must be at most 1000 characters"),

    body("paymentMethod")
        .optional()
        .isIn(PAYMENT_METHODS)
        .withMessage(`Payment method must be one of: ${PAYMENT_METHODS.join(", ")}`),

    body("expenseDate")
        .optional()
        .isISO8601().withMessage("Expense date must be a valid ISO 8601 date"),

    body("tags")
        .optional()
        .isArray().withMessage("Tags must be an array"),
];

export const expenseIdValidation = [
    param("id")
        .isMongoId().withMessage("Invalid expense ID"),
];

export const getExpensesQueryValidation = [
    query("categoryId").optional({ values: 'falsy' }).isMongoId().withMessage("Invalid category ID"),
    query("startDate").optional({ values: 'falsy' }).isISO8601().withMessage("startDate must be a valid date"),
    query("endDate").optional({ values: 'falsy' }).isISO8601().withMessage("endDate must be a valid date"),
    query("minAmount").optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage("minAmount must be a positive number"),
    query("maxAmount").optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage("maxAmount must be a positive number"),
    query("paymentMethod").optional({ values: 'falsy' }).isIn(PAYMENT_METHODS).withMessage("Invalid payment method"),
    query("page").optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional({ values: 'falsy' }).isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("sortBy").optional({ values: 'falsy' }).isIn(["expenseDate", "amount", "title", "createdAt"]).withMessage("Invalid sortBy field"),
];
