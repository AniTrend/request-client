import type { RequestConfig, RequestResponse } from './types.ts';
import { RequestError } from './types.ts';
import {
  type ErrorInterceptor,
  InterceptorManager,
  type RequestInterceptor,
  type ResponseInterceptor,
} from './interceptors.ts';

/**
 * Axios-style fetch wrapper for Deno
 */
export class RequestClient {
  private config: RequestConfig;
  public interceptors: {
    request: InterceptorManager<RequestInterceptor>;
    response: InterceptorManager<ResponseInterceptor>;
    error: InterceptorManager<ErrorInterceptor>;
  };

  constructor(config: RequestConfig = {}) {
    this.config = config;
    this.interceptors = {
      request: new InterceptorManager<RequestInterceptor>(),
      response: new InterceptorManager<ResponseInterceptor>(),
      error: new InterceptorManager<ErrorInterceptor>(),
    };
  }

  /**
   * Build full URL with base URL and params
   */
  private buildURL(url: string, config: RequestConfig): string {
    const baseURL = config.baseURL ?? this.config.baseURL ?? '';
    const fullURL = baseURL ? new URL(url, baseURL).toString() : url;

    if (!config.params) return fullURL;

    const urlObj = new URL(fullURL);
    Object.entries(config.params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, String(value));
    });

    return urlObj.toString();
  }

  /**
   * Merge headers from default config and request config
   */
  private mergeHeaders(config: RequestConfig): Headers {
    const headers = new Headers();

    // Add default headers
    if (this.config.headers) {
      Object.entries(this.config.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    // Add request-specific headers
    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    return headers;
  }

  /**
   * Process response based on responseType
   */
  private async processResponse<T>(
    response: Response,
    responseType: RequestConfig['responseType'] = 'json',
  ): Promise<T> {
    switch (responseType) {
      case 'json':
        return await response.json() as T;
      case 'text':
        return await response.text() as T;
      case 'blob':
        return await response.blob() as T;
      case 'arrayBuffer':
        return await response.arrayBuffer() as T;
      default:
        return await response.json() as T;
    }
  }

  /**
   * Make an HTTP request
   */
  async request<T = unknown>(
    config: RequestConfig & { url?: string; method?: string },
  ): Promise<RequestResponse<T>> {
    // Apply request interceptors
    let requestConfig = { ...this.config, ...config };
    for (const interceptor of this.interceptors.request.getAll()) {
      requestConfig = await interceptor(requestConfig);
    }

    const url = this.buildURL(config.url ?? '', requestConfig);
    const headers = this.mergeHeaders(requestConfig);
    const method = config.method?.toUpperCase() ?? 'GET';

    // Handle timeout
    let timeoutId: number | undefined;
    const controller = new AbortController();
    const signal = requestConfig.signal ?? controller.signal;

    if (requestConfig.timeout) {
      timeoutId = setTimeout(() => {
        controller.abort();
      }, requestConfig.timeout);
    }

    try {
      // Build fetch options
      const fetchOptions: RequestInit = {
        method,
        headers,
        signal,
      };

      // Add body for methods that support it
      if (
        requestConfig.data &&
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
      ) {
        if (typeof requestConfig.data === 'string') {
          fetchOptions.body = requestConfig.data;
        } else {
          fetchOptions.body = JSON.stringify(requestConfig.data);
          if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
          }
        }
      }

      // Make the request
      const response = await fetch(url, fetchOptions);

      // Validate status
      const validateStatus = requestConfig.validateStatus ??
        ((status: number) => status >= 200 && status < 300);

      if (!validateStatus(response.status)) {
        throw new RequestError(
          `Request failed with status ${response.status}`,
          {
            data: await this.processResponse(
              response,
              requestConfig.responseType,
            ),
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: requestConfig,
          },
          requestConfig,
        );
      }

      // Process response
      const data = await this.processResponse<T>(
        response,
        requestConfig.responseType,
      );

      let requestResponse: RequestResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: requestConfig,
      };

      // Apply response interceptors
      for (const interceptor of this.interceptors.response.getAll()) {
        requestResponse = await interceptor(requestResponse);
      }

      return requestResponse;
    } catch (error) {
      let requestError: RequestError;

      if (error instanceof RequestError) {
        requestError = error;
      } else if (error instanceof Error) {
        if (error.name === 'AbortError') {
          requestError = new RequestError('Request timeout', undefined, config);
        } else {
          requestError = new RequestError(
            error.message,
            undefined,
            requestConfig,
          );
        }
      } else {
        requestError = new RequestError(
          'Unknown error occurred',
          undefined,
          requestConfig,
        );
      }

      // Apply error interceptors
      for (const interceptor of this.interceptors.error.getAll()) {
        requestError = await interceptor(requestError);
      }

      throw requestError;
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    }
  }

  /**
   * Convenience methods for common HTTP verbs
   */
  get<T = unknown>(
    url: string,
    config?: RequestConfig,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, url, method: 'POST', data });
  }

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PUT', data });
  }

  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PATCH', data });
  }

  delete<T = unknown>(
    url: string,
    config?: RequestConfig,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }

  head<T = unknown>(
    url: string,
    config?: RequestConfig,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, url, method: 'HEAD' });
  }

  options<T = unknown>(
    url: string,
    config?: RequestConfig,
  ): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, url, method: 'OPTIONS' });
  }
}

/**
 * Create a new request client instance
 */
export function createClient(config?: RequestConfig): RequestClient {
  return new RequestClient(config);
}
