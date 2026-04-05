import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/panels/**"],
      reporter: ["text", "text-summary", "html"],
    },
    alias: {
      vscode: new URL("./test/__mocks__/vscode.ts", import.meta.url).pathname,
    },
  },
});
