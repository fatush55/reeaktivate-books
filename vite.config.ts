import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./testSetup.ts"],
    include: ["src/**/*.spec.ts"],
    exclude: ["node_modules", "dist", "src/**/*.tsx", "src/**/*.jsx"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.tsx",
        "src/**/*.jsx",
        "src/**/*.d.ts",
        "src/**/types.ts",
        "src/main.tsx",
        "src/**/index.ts",
        "src/mocks/**",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});
