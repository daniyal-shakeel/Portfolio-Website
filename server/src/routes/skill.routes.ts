import { Router } from "express";
import { SkillController } from "../controllers/skill.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", SkillController.getAll);
router.post("/", authMiddleware, SkillController.create);
router.put("/:id", authMiddleware, SkillController.update);
router.delete("/:id", authMiddleware, SkillController.delete);

export default router;
