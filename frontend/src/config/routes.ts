// @ts-ignore
const modules = import.meta.glob("../routes/**/*.{tsx,jsx}", { eager: true });

/**
 * Dynamically populate all available routes from the src/routes directory.
 * Excludes catch-all/wildcard routes to allow standard 404 handling.
 */
export const ALL_ROUTES = Object.keys(modules)
  .filter(key => !key.includes("[..."))
  .map(key => {
    // Expected key format: "../routes/path/to/page.tsx"
    let path = key
      .replace(/^.*\/routes/, "") // Remove everything up to /routes
      .replace(/\.[jt]sx?$/, "")  // Remove extension
      .replace(/\/index$/, "");     // Remove trailing /index

    return path === "" ? "/" : path;
  });

export const UNPROTECTED_ROUTES = [
  "/",
  "/login",
  "/error",
  "/404"
];

/**
 * Normalizes a path by removing the UI base path prefix and trailing slashes.
 */
function getRelativePath(path: string): string {
  const uiUrl = import.meta.env.VITE_UI_URL || "";
  let cleanPath = path;

  // Remove UI base path prefix if present
  if (uiUrl && path.startsWith(uiUrl)) {
    cleanPath = path.substring(uiUrl.length);
  }

  // Normalize: ensure starts with / and remove trailing /
  cleanPath = cleanPath.replace(/\/$/, "") || "/";
  if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;

  return cleanPath;
}

/**
 * Checks if a given path corresponds to a defined static route.
 */
export function isValidRoute(path: string): boolean {
  const rel = getRelativePath(path);
  return ALL_ROUTES.includes(rel);
}

/**
 * Checks if a given path is allowed for guest users.
 */
export function isUnprotected(path: string): boolean {
  const rel = getRelativePath(path);
  return UNPROTECTED_ROUTES.includes(rel);
}
