import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: env.allowedOrigins,
    })
  );
  app.use(express.json());
  app.use("/api", router);
  app.use(errorHandler);
  return app;
}
