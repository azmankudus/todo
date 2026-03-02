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

const uiPath = `${cleanContextPath}/ui`;
const backendPort = backendProps["micronaut.server.port"] || "8080";
const isDev = process.env.NODE_ENV !== "production";

// In dev: point directly to backend server (absolute URL)
// In prod: use relative path (served by same server via reverse proxy)
const apiPath = isDev
  ? `http://localhost:${backendPort}${cleanContextPath}/api`
  : `${cleanContextPath}/api`;

export default defineConfig({
  ssr: false,
  vite: {
    plugins: [
      tailwindcss()
    ],
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(apiPath),
      "import.meta.env.VITE_BASE_URL": JSON.stringify(uiPath)
    },
    build: {
      minify: "esbuild",
      cssMinify: true,
      sourcemap: false
    }
  },
  server: {
    preset: "static",
    baseURL: uiPath
  }
});
