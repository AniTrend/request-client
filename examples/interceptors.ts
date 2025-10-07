/**
 * Interceptors example for request-client
 *
 * Run with: deno run --allow-net examples/interceptors.ts
 */

import { createClient } from '../src/mod.ts';

const client = createClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

// Add a request interceptor
client.interceptors.request.use((config) => {
  console.log('→ Request interceptor:', config.url);
  // Add a timestamp header
  config.headers = {
    ...config.headers,
    'X-Request-Time': new Date().toISOString(),
  };
  return config;
});

// Add a response interceptor
client.interceptors.response.use((response) => {
  console.log('← Response interceptor:', response.status);
  return response;
});

// Add an error interceptor
client.interceptors.error.use((error) => {
  console.error('✗ Error interceptor:', error.message);
  return error;
});

console.log('Making request with interceptors...\n');

try {
  const response = await client.get('/posts/1');
  console.log('\nSuccess! Status:', response.status);
  console.log('Headers sent:', response.config.headers);
} catch (error) {
  console.error('Failed:', error.message);
}
