import { defineConfig } from "@solidjs/start/config";
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
      if (parts.length >= 2) {
        backendProps[parts[0].trim()] = parts.slice(1).join("=").trim();
      }
    });
  }
} catch (e) { }

const contextPath = backendProps["micronaut.server.context-path"] || "";
const cleanContextPath = contextPath === "/" ? "" : contextPath.replace(/\/$/, "");

// @ts-ignore
const basePath = process.env.VITE_BASE_URL || `${cleanContextPath}/ui`;
// @ts-ignore
const apiPath = process.env.VITE_API_URL || `${cleanContextPath}/api`;

export default defineConfig({
  ssr: false,
  vite: {
    // Explicitly configure Vite's base for SSR layout boundaries
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(apiPath),
      "import.meta.env.VITE_BASE_URL": JSON.stringify(basePath)
    }
  },
  server: {
    preset: "static",
    baseURL: cleanContextPath || "/", // Root Nitro at the backend API's mount point (e.g. /todo)
    routeRules: {
      // Map Solid routing fallbacks since root Nitro is tracking here
      [basePath + "/**"]: { index: true }, 
    },
    proxy: {
      [apiPath]: {
        target: "http://localhost:8080" + apiPath, // Proxy over to the identical backend mapping
        changeOrigin: true
      }
    }
  }
});
