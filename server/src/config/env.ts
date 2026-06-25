import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = process.env.NODE_ENV === "production" ? "env.production" : "env.development";
dotenv.config({ path: path.resolve(__dirname, "../../env", envFile) });

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  mongodbUri: process.env.MONGODB_URI || "",
  adminUsername: process.env.ADMIN_USERNAME || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  jwtSecret: process.env.JWT_SECRET || "",
  corsOrigin: process.env.CORS_ORIGIN || "",
  groqApiKey: process.env.GROQ_API_KEY || "",
};

if (!config.mongodbUri || !config.adminUsername || !config.adminPassword || !config.jwtSecret || !config.groqApiKey) {
  throw new Error("Missing mandatory environment configurations.");
}
