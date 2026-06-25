import { Router } from "express";
import { TaglineController } from "../controllers/tagline.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", TaglineController.getAll);
router.post("/", authMiddleware, TaglineController.create);
router.put("/:id", authMiddleware, TaglineController.update);
router.delete("/:id", authMiddleware, TaglineController.delete);

export default router;
