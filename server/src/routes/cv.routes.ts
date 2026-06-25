import { Router } from "express";
import { CvController } from "../controllers/cv.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/status", CvController.getStatus);
router.get("/download", CvController.download);
router.post("/upload", authMiddleware, CvController.upload);
router.delete("/", authMiddleware, CvController.delete);

export default router;
