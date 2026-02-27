import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify("/api")
  },
  plugins: [solidPlugin()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./setupVitest.ts"],
    server: {
      deps: {
        inline: [/solid-js/, /@solidjs\/router/]
      }
    }
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
