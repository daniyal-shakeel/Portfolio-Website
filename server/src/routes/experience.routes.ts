import { Router } from "express";
import { ExperienceController } from "../controllers/experience.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", ExperienceController.getAll);
router.post("/", authMiddleware, ExperienceController.create);
router.put("/:id", authMiddleware, ExperienceController.update);
router.delete("/:id", authMiddleware, ExperienceController.delete);

export default router;
