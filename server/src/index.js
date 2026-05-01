import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function start() {
  await connectDatabase();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to boot server", error);
  process.exit(1);
});
