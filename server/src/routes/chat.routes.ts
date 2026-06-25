import { Router } from "express";
import { ChatController } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", ChatController.ask);
router.get("/session", ChatController.getSessionStatus);
router.post("/session", ChatController.createSession);
router.get("/logs", authMiddleware, ChatController.getLogs);
router.get("/stats", authMiddleware, ChatController.getStats);

export default router;
