import { Router } from "express";
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";
import {
    createCategoryValidation,
    updateCategoryValidation,
    categoryIdValidation,
} from "../validations/category.validation.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", createCategoryValidation, validate, createCategory);
router.get("/", getCategories);
router.get("/:id", categoryIdValidation, validate, getCategoryById);
router.put("/:id", updateCategoryValidation, validate, updateCategory);
router.delete("/:id", categoryIdValidation, validate, deleteCategory);

export default router;
