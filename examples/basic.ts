/**
 * Basic usage example for request-client
 *
 * Run with: deno run --allow-net examples/basic.ts
 */

import { createClient } from '../src/mod.ts';

// Create a simple client
const client = createClient();

// Make a basic GET request
console.log('Making GET request...');
try {
  const response = await client.get(
    'https://jsonplaceholder.typicode.com/posts/1',
  );
  console.log('Status:', response.status);
  console.log('Data:', response.data);
} catch (error) {
  console.error('Error:', error.message);
}

// Create a client with base URL and headers
console.log('\nUsing client with configuration...');
const apiClient = createClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Make a POST request
console.log('\nMaking POST request...');
try {
  const newPost = await apiClient.post('/posts', {
    title: 'Test Post',
    body: 'This is a test post',
    userId: 1,
  });
  console.log('Status:', newPost.status);
  console.log('Created post:', newPost.data);
} catch (error) {
  console.error('Error:', error.message);
}

// Using query parameters
console.log('\nMaking GET request with query params...');
try {
  const posts = await apiClient.get('/posts', {
    params: {
      userId: 1,
    },
  });
  console.log('Status:', posts.status);
  console.log('Found posts:', Array.isArray(posts.data) ? posts.data.length : 0);
} catch (error) {
  console.error('Error:', error.message);
}
