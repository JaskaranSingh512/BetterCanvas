const baseUrl = process.env.API_BASE_URL || "http://localhost:4000/api";

async function run() {
  const health = await fetch(`${baseUrl}/health`);
  if (!health.ok) {
    throw new Error("Health check failed");
  }

  const topics = await fetch(`${baseUrl}/help/topics`);
  if (!topics.ok) {
    throw new Error("Help topics endpoint failed");
  }

  console.log("Smoke checks passed");
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
