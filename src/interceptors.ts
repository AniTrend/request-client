import type { RequestConfig, RequestResponse } from './types.ts';
import { RequestError } from './types.ts';

/**
 * Request interceptor function
 */
export type RequestInterceptor = (
  config: RequestConfig,
) => RequestConfig | Promise<RequestConfig>;

/**
 * Response interceptor function
 */
export type ResponseInterceptor = <T = unknown>(
  response: RequestResponse<T>,
) => RequestResponse<T> | Promise<RequestResponse<T>>;

/**
 * Error interceptor function
 */
export type ErrorInterceptor = (
  error: RequestError,
) => RequestError | Promise<RequestError>;

/**
 * Interceptor manager for request/response interceptors
 */
export class InterceptorManager<T> {
  private interceptors: T[] = [];

  /**
   * Add a new interceptor
   */
  use(interceptor: T): number {
    this.interceptors.push(interceptor);
    return this.interceptors.length - 1;
  }

  /**
   * Remove an interceptor by ID
   */
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors.splice(id, 1);
    }
  }

  /**
   * Get all interceptors
   */
  getAll(): T[] {
    return this.interceptors;
  }
}
