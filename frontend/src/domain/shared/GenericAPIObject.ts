export interface GenericAPIObject {
  client: {
    http: {
      headers: Record<string, string>;
    };
    request: {
      trace_id: string;
      timestamp: string;
    };
    response: {
      timestamp: string;
      duration: string;
    };
  };
  server: {
    http: {
      status: string;
      headers: Record<string, string>;
    };
    request: {
      trace_id: string;
      timestamp: string;
    };
    response: {
      timestamp: string;
      duration: string;
      status: string;
      code: string;
      message: string;
      details: any;
    };
  };
}
