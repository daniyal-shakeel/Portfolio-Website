import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { sanitizeMiddleware } from "./utils/sanitize.js";
import { globalLimiter } from "./middleware/rate-limiter.middleware.js";
import authRouter from "./routes/auth.routes.js";
import healthRouter from "./routes/health.routes.js";
import projectRouter from "./routes/project.routes.js";
import experienceRouter from "./routes/experience.routes.js";
import skillRouter from "./routes/skill.routes.js";
import educationRouter from "./routes/education.routes.js";
import settingsRouter from "./routes/settings.routes.js";
import taglineRouter from "./routes/tagline.routes.js";
import linkRouter from "./routes/link.routes.js";
import statRouter from "./routes/stat.routes.js";
import cvRouter from "./routes/cv.routes.js";
import chatRouter from "./routes/chat.routes.js";
import learningRouter from "./routes/learning.routes.js";



const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const origins = config.corsOrigin.split(",").map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS validation failure"));
      }
    },
    credentials: true,
  })
);

app.use("/api/cv/upload", express.json({ limit: "5mb" }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(globalLimiter);
app.use(sanitizeMiddleware);
app.use("/project_thumbnails", express.static(path.join(process.cwd(), "project_thumbnails")));

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/experience", experienceRouter);
app.use("/api/skills", skillRouter);
app.use("/api/education", educationRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/taglines", taglineRouter);
app.use("/api/links", linkRouter);
app.use("/api/stats", statRouter);
app.use("/api/cv", cvRouter);
app.use("/api/chat", chatRouter);
app.use("/api/learning", learningRouter);



app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({ error: "An unexpected error occurred" });
});

connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`Server started successfully on port ${config.port}`);
  });
});
