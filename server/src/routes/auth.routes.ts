import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rate-limiter.middleware.js";

const router = Router();

router.post("/login", authLimiter, AuthController.login);
router.get("/verify", authMiddleware, AuthController.verify);
router.post("/logout", AuthController.logout);

export default router;
