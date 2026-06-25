import { Router } from "express";
import { ProjectController } from "../controllers/project.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", ProjectController.getAll);
router.post("/", authMiddleware, ProjectController.create);
router.put("/:id", authMiddleware, ProjectController.update);
router.delete("/:id", authMiddleware, ProjectController.delete);

export default router;
