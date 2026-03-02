import { createSignal } from "solid-js";
import { ApiResponse } from "../domain/ApiResponse";

export interface GlobalError {
  code: string | number;
  message: string;
  details?: any;
  data?: ApiResponse;
}

const [currentError, setCurrentError] = createSignal<GlobalError | null>(null);
const [backendEnabled, setBackendEnabled] = createSignal(false);

export const errorStore = {
  error: currentError,
  useBackend: backendEnabled,
  setError: (error: GlobalError | null) => setCurrentError(error),
  setBackend: setBackendEnabled,
  clearError: () => setCurrentError(null),
};

export function handleGlobalError(response: ApiResponse) {
  // Extract HTTP status code from http_status string (e.g., "500 Internal Server Error")
  // Fallback to the code property if missing
  const httpCodeMatch = response.http_status?.match(/^(\d+)/);
  const code = httpCodeMatch ? httpCodeMatch[1] : (response.code || "500");

  // We consider it an error if status is ERROR or if the HTTP code is 4xx/5xx
  const isError = response.status === "ERROR" || (Number(code) >= 400);

  if (isError) {
    errorStore.setError({
      code: code,
      message: response.message || "An unexpected error occurred",
      details: response.details,
      data: response
    });
    return true;
  }
  return false;
}
