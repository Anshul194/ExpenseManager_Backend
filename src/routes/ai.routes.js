import { Router } from "express";
import { generateInsights, getLatestInsight } from "../controllers/ai.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/insights", generateInsights);
router.get("/insights/latest", getLatestInsight);

export default router;
