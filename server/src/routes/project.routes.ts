import { Router } from "express";
import { ProjectController } from "../controllers/project.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadMiddleware } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", ProjectController.getAll);
router.post("/", authMiddleware, ProjectController.create);
router.post("/upload", authMiddleware, uploadMiddleware.single("thumbnail"), ProjectController.uploadThumbnail);
router.put("/:id", authMiddleware, ProjectController.update);
router.delete("/:id", authMiddleware, ProjectController.delete);

export default router;
