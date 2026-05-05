// Inject a global utility or variable across the project
globalThis.APP_START_TIME = Date.now();

// Verify critical environment variables are present
if (!process.env.DATABASE_URL) {
  console.warn("⚠️ Warning: DATABASE_URL is not set in your environment!");
}

console.log("🚀 Global preload complete.");
