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
