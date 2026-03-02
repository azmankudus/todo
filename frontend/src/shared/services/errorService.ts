import { ApiResponse } from "../domain/ApiResponse";
import { errorStore } from "../stores/errorStore";
import { getErrorConfig } from "../../config/errors";
import { ApiStatus } from "../domain/ApiStatus";
import { apiClient } from "../utils/api";

export const generateMockErrorInfo = (code: string | number): ApiResponse => {
  const config = getErrorConfig(code);
  const now = new Date().toISOString();
  return {
    status: ApiStatus.ERROR,
    code: String(code),
    message: config.description,
    trace_id: `MOCK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    timestamp: now,
    http_status: `${code} ${config.name.toUpperCase().replace(/\s/g, '_')}`,
    duration: `${Math.floor(Math.random() * 200 + 50)}ms`,
    start: now,
    details: {
      "simulation_mode": "Local Diagnostic",
      "failure_vector": config.isServerError ? "SERVER_OVERSIGHT" : "CLIENT_SIGNATURE_MISMATCH",
      "severity": config.isServerError ? "CRITICAL" : "CONTROLLED",
      "subsystem": "SIMULATED_LOGIC",
      "isolation": "CONTAINED"
    }
  };
};

export const fetchErrorInfo = async (code: string | number) => {
  if (!code) return null;
  if (!errorStore.useBackend()) return generateMockErrorInfo(code);

  const numCode = Number(code);
  if (isNaN(numCode)) return null;

  try {
    const data = await apiClient(`/error/${numCode}`, { skipGlobalError: true });
    return data as ApiResponse;
  } catch (e) {
    console.error("Failed to fetch error info:", e);
    return generateMockErrorInfo(code); // Fallback to mock if API fails
  }
};
