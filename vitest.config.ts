import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: "happy-dom",
    hookTimeout: 15000,

    include: ["tests/unit/**/*.test.{ts,tsx,js,jsx}"],
    pool: "forks",
    setupFiles: ["tests/setup.ts"],
    testTimeout: 30000,
  },
});
