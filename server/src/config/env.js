import dotenv from "dotenv";

dotenv.config();

const parseAllowedOrigins = (value) => {
  if (!value) {
    return ["http://localhost:5173"];
  }
  return value.split(",").map((item) => item.trim()).filter(Boolean);
};

export const env = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bettercanvas",
  jwtSecret: process.env.JWT_SECRET || "bettercanvas_dev_secret",
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
};
