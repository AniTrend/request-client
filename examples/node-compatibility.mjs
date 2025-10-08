/**
 * Node.js Compatibility Example
 *
 * This example demonstrates how to use @anitrend/request-client in Node.js
 * environments through JSR's npm compatibility layer.
 *
 * Prerequisites:
 * 1. Node.js 18+ (required for native Fetch API support)
 * 2. Install the package: npx jsr add @anitrend/request-client
 *
 * Run this example:
 * node examples/node-compatibility.mjs
 */

// Import from the JSR package (after running: npx jsr add @anitrend/request-client)
import { createClient } from '@anitrend/request-client';

async function main() {
  console.log('🚀 Testing @anitrend/request-client in Node.js\n');

  // Create a client instance
  const client = createClient({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
      'User-Agent': 'request-client-node-example',
    },
    timeout: 10000,
  });

  try {
    // Test 1: Simple GET request
    console.log('📥 Test 1: Fetching posts...');
    const postsResponse = await client.get('/posts', {
      params: { _limit: 3 },
    });
    console.log(
      `✅ Received ${postsResponse.data.length} posts`,
    );
    console.log(`   Status: ${postsResponse.status}`);
    console.log(`   First post: ${postsResponse.data[0].title}\n`);

    // Test 2: POST request
    console.log('📤 Test 2: Creating a new post...');
    const newPost = await client.post('/posts', {
      title: 'Node.js Test Post',
      body: 'Testing from Node.js environment',
      userId: 1,
    });
    console.log(`✅ Created post with ID: ${newPost.data.id}`);
    console.log(`   Status: ${newPost.status}\n`);

    // Test 3: Using interceptors
    console.log('🔄 Test 3: Testing interceptors...');
    client.interceptors.request.use((config) => {
      console.log(
        `   → Interceptor: Request to ${config.baseURL}${config.url ?? ''}`,
      );
      return config;
    });

    client.interceptors.response.use((response) => {
      console.log(`   ← Interceptor: Response status ${response.status}`);
      return response;
    });

    await client.get('/users/1');
    console.log('✅ Interceptors working correctly\n');

    // Test 4: Error handling
    console.log('🔍 Test 4: Testing error handling...');
    try {
      await client.get('/invalid-endpoint-404');
    } catch (error) {
      if (error.name === 'RequestError') {
        console.log(`✅ Error caught correctly: ${error.message}`);
        console.log(`   Status: ${error.response?.status}\n`);
      }
    }

    console.log('🎉 All tests passed! Node.js compatibility confirmed.');
    console.log('✨ The package works seamlessly in Node.js 18+\n');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run the example
main();
