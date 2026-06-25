import { Router } from "express";
import { LinkController } from "../controllers/link.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", LinkController.getAll);
router.post("/", authMiddleware, LinkController.create);
router.put("/:id", authMiddleware, LinkController.update);
router.delete("/:id", authMiddleware, LinkController.delete);

export default router;
