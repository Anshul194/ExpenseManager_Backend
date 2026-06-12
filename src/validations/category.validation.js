import { body, param } from "express-validator";

export const createCategoryValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("Category name is required")
        .isLength({ max: 50 }).withMessage("Category name must be at most 50 characters"),

    body("color")
        .optional()
        .matches(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/)
        .withMessage("Color must be a valid hex code (e.g. #FF6B6B)"),

    body("monthlyBudget")
        .optional()
        .isFloat({ min: 0 }).withMessage("Monthly budget must be a positive number"),
];

export const updateCategoryValidation = [
    param("id")
        .isMongoId().withMessage("Invalid category ID"),

    body("name")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("Category name must be at most 50 characters"),

    body("color")
        .optional()
        .matches(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/)
        .withMessage("Color must be a valid hex code"),

    body("monthlyBudget")
        .optional()
        .isFloat({ min: 0 }).withMessage("Monthly budget must be a positive number"),
];

export const categoryIdValidation = [
    param("id")
        .isMongoId().withMessage("Invalid category ID"),
];
