import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendProps: Record<string, string> = {};
try {
  const propsPath = path.resolve(__dirname, "../backend/src/main/resources/application.properties");
  if (fs.existsSync(propsPath)) {
    const fileContent = fs.readFileSync(propsPath, "utf-8");
    fileContent.split("\n").forEach((line: string) => {
      const parts = line.split("=");
      if (parts.length >= 2) backendProps[parts[0].trim()] = parts.slice(1).join("=").trim();
    });
  }
} catch (e) { }

const contextPath = backendProps["micronaut.server.context-path"] || "";
const cleanContextPath = contextPath === "/" ? "" : contextPath.replace(/\/$/, "");

const isDev = process.argv.includes("dev") || process.env.NODE_ENV === "development";

// @ts-ignore
const basePath = process.env.VITE_BASE_URL || `${cleanContextPath}/ui`;
// @ts-ignore
const realApiPath = process.env.VITE_API_URL || `${cleanContextPath}/api`;
const proxyApiPath = isDev ? `${basePath}/api-proxy` : realApiPath;

export default defineConfig({
  ssr: false,
  vite: {
    plugins: [
      tailwindcss()
    ],
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(proxyApiPath),
      "import.meta.env.VITE_BASE_URL": JSON.stringify(basePath)
    },
    build: {
      minify: "esbuild", // Explicitly ensure minification is enabled
      cssMinify: true,
      sourcemap: false // Disable sourcemaps for smaller production assets
    }
  },
  server: {
    preset: "static",
    baseURL: basePath,
    routeRules: isDev ? {
      [`${proxyApiPath}/**`]: { proxy: "http://localhost:8080" + realApiPath + "/**" }
    } : {}
  }
});
