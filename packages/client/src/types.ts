/**
 * Request configuration options
 */
export interface RequestConfig {
  /** Base URL for all requests */
  baseURL?: string;
  /** Request headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Query parameters */
  params?: Record<string, string | number | boolean>;
  /** Request body */
  data?: unknown;
  /** Response type */
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer';
  /** AbortSignal for request cancellation */
  signal?: AbortSignal;
  /** Validate status code (default: status >= 200 && status < 300) */
  validateStatus?: (status: number) => boolean;
}

/**
 * Response object returned by the request client
 */
export interface RequestResponse<T = unknown> {
  /** Response data */
  data: T;
  /** HTTP status code */
  status: number;
  /** HTTP status text */
  statusText: string;
  /** Response headers */
  headers: Headers;
  /** Request configuration */
  config: RequestConfig;
}

/**
 * Request error
 */
export class RequestError extends Error {
  constructor(
    message: string,
    public response?: RequestResponse,
    public config?: RequestConfig,
  ) {
    super(message);
    this.name = 'RequestError';
  }
}
