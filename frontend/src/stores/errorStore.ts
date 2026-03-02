import { createSignal } from "solid-js";
import { ApiResponse } from "../domain/shared/ApiResponse";

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
  if (response.status === "ERROR" || (Number(response.code) >= 400)) {
    errorStore.setError({
      code: response.code || "500",
      message: response.message || "An unexpected error occurred",
      details: response.details,
      data: response
    });
    return true;
  }
  return false;
}
