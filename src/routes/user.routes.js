import { Router } from "express";
import { updateProfile, updatePassword } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.patch("/profile", updateProfile);
router.patch("/password", updatePassword);

export default router;
