import { Router } from "express";
import {
    getSummary,
    getCategoryBreakdown,
    getSpendingTrends,
    getBudgetStatus,
    getTopExpenses,
} from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/summary", getSummary);
router.get("/category-breakdown", getCategoryBreakdown);
router.get("/trends", getSpendingTrends);
router.get("/budget-status", getBudgetStatus);
router.get("/top-expenses", getTopExpenses);

export default router;
