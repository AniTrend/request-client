/**
 * @module request-client
 *
 * A tiny, dependency-free, axios-style fetch wrapper for Deno
 *
 * @example
 * ```ts
 * import { createClient } from '@anitrend/request-client';
 *
 * const client = createClient({
 *   baseURL: 'https://api.example.com',
 *   headers: {
 *     'Authorization': 'Bearer token',
 *   },
 * });
 *
 * const response = await client.get('/users');
 * console.log(response.data);
 * ```
 */

export { createClient, RequestClient } from './request.client.ts';
export type { RequestConfig, RequestResponse } from './types.ts';
export { RequestError } from './types.ts';
export {
  type ErrorInterceptor,
  InterceptorManager,
  type RequestInterceptor,
  type ResponseInterceptor,
} from './interceptors.ts';
