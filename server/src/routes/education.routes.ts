import { Router } from "express";
import { EducationController } from "../controllers/education.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", EducationController.getAll);
router.post("/", authMiddleware, EducationController.create);
router.put("/:id", authMiddleware, EducationController.update);
router.delete("/:id", authMiddleware, EducationController.delete);

export default router;
