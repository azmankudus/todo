import { getAuthHeaders } from "../stores/authBase";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export interface ApiResponse<T = any> {
  timestamp: string;
  http_status: string;
  trace_id: string;
  status: "SUCCESS" | "WARNING" | "ERROR";
  code: string;
  message: string;
  details: T;
  duration: string;
  start?: string;
}

export async function apiClient<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

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
      details: {}
    };
  }

  if (!response.ok && !data.status) {
    data.status = "ERROR";
  }

  return data as ApiResponse<T>;
}
