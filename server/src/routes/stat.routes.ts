import { Router } from "express";
import { StatController } from "../controllers/stat.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", StatController.getAll);
router.post("/", authMiddleware, StatController.create);
router.put("/:id", authMiddleware, StatController.update);
router.delete("/:id", authMiddleware, StatController.delete);

export default router;
