import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", SettingsController.get);
router.put("/", authMiddleware, SettingsController.update);

export default router;
