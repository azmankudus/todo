import { getAuthHeaders } from "../stores/authBase";
import { handleGlobalError } from "../stores/errorStore";
import { ApiResponse } from "../domain/shared/ApiResponse";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export type { ApiResponse };

export async function apiClient<T = any>(
  path: string,
  options: RequestInit & { skipGlobalError?: boolean } = {}
): Promise<ApiResponse<T>> {
  const { skipGlobalError, ...fetchOptions } = options;
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const start = new Date().toISOString();

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Auto-add auth headers
  const authHeaders = getAuthHeaders();
  Object.entries(authHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  // Try to parse JSON even for error codes as we expect a standardized envelope
  let data: any;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    // Fallback for non-JSON responses
    const text = await response.text();
    data = {
      status: response.ok ? "SUCCESS" : "ERROR",
      message: text || response.statusText,
      http_status: `${response.status} ${response.statusText}`,
      code: response.status.toString(),
      details: {}
    };
  }

  if (!response.ok) {
    if (!data.status) data.status = "ERROR";
    if (!data.code) data.code = response.status.toString();
    if (!data.start) data.start = start;

    // Globally handle 4xx/5xx errors
    if (!skipGlobalError) {
      handleGlobalError(data);
    }
  }

  return data as ApiResponse<T>;
}
