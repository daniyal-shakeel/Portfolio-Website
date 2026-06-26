import { Router } from "express";
import { LearningController } from "../controllers/learning.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", LearningController.getAll);
router.post("/", authMiddleware, LearningController.create);
router.put("/:id", authMiddleware, LearningController.update);
router.delete("/:id", authMiddleware, LearningController.delete);

export default router;
