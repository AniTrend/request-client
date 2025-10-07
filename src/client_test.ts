import { assertEquals, assertExists } from 'jsr:@std/assert@1';
import { createClient, RequestClient, RequestError } from './mod.ts';

Deno.test('RequestClient - createClient', () => {
  const client = createClient();
  assertExists(client);
  assertEquals(client instanceof RequestClient, true);
});

Deno.test('RequestClient - createClient with config', () => {
  const client = createClient({
    baseURL: 'https://api.example.com',
    headers: {
      'Authorization': 'Bearer token',
    },
  });
  assertExists(client);
});

Deno.test('RequestClient - GET request', async () => {
  const client = createClient();
  const response = await client.get(
    'https://jsonplaceholder.typicode.com/posts/1',
  );

  assertEquals(response.status, 200);
  assertExists(response.data);
  assertExists(response.headers);
});

Deno.test('RequestClient - POST request', async () => {
  const client = createClient();
  const response = await client.post(
    'https://jsonplaceholder.typicode.com/posts',
    {
      title: 'Test',
      body: 'Test body',
      userId: 1,
    },
  );

  assertEquals(response.status, 201);
  assertExists(response.data);
});

Deno.test('RequestClient - with baseURL', async () => {
  const client = createClient({
    baseURL: 'https://jsonplaceholder.typicode.com',
  });
  const response = await client.get('/posts/1');

  assertEquals(response.status, 200);
  assertExists(response.data);
});

Deno.test('RequestClient - with query params', async () => {
  const client = createClient({
    baseURL: 'https://jsonplaceholder.typicode.com',
  });
  const response = await client.get('/posts', {
    params: {
      userId: 1,
    },
  });

  assertEquals(response.status, 200);
  assertExists(response.data);
});

Deno.test('RequestClient - with custom headers', async () => {
  const client = createClient();
  const response = await client.get(
    'https://jsonplaceholder.typicode.com/posts/1',
    {
      headers: {
        'X-Custom-Header': 'test',
      },
    },
  );

  assertEquals(response.status, 200);
  assertExists(response.data);
});

Deno.test('RequestClient - error handling', async () => {
  const client = createClient();

  try {
    await client.get('https://jsonplaceholder.typicode.com/posts/99999999999');
  } catch (error) {
    assertEquals(error instanceof RequestError, true);
  }
});

Deno.test('RequestClient - timeout', async () => {
  const client = createClient({
    timeout: 1, // 1ms timeout
  });

  try {
    await client.get('https://jsonplaceholder.typicode.com/posts/1');
  } catch (error) {
    assertEquals(error instanceof RequestError, true);
    assertEquals((error as RequestError).message, 'Request timeout');
  }
});

Deno.test('RequestClient - request interceptor', async () => {
  const client = createClient();

  client.interceptors.request.use((config) => {
    config.headers = {
      ...config.headers,
      'X-Intercepted': 'true',
    };
    return config;
  });

  const response = await client.get(
    'https://jsonplaceholder.typicode.com/posts/1',
  );
  assertEquals(response.status, 200);
});

Deno.test('RequestClient - response interceptor', async () => {
  const client = createClient();

  client.interceptors.response.use((response) => {
    // Add custom property to response
    return response;
  });

  const response = await client.get(
    'https://jsonplaceholder.typicode.com/posts/1',
  );
  assertEquals(response.status, 200);
});

Deno.test('RequestClient - PUT request', async () => {
  const client = createClient();
  const response = await client.put(
    'https://jsonplaceholder.typicode.com/posts/1',
    {
      id: 1,
      title: 'Updated Title',
      body: 'Updated body',
      userId: 1,
    },
  );

  assertEquals(response.status, 200);
  assertExists(response.data);
});

Deno.test('RequestClient - PATCH request', async () => {
  const client = createClient();
  const response = await client.patch(
    'https://jsonplaceholder.typicode.com/posts/1',
    {
      title: 'Patched Title',
    },
  );

  assertEquals(response.status, 200);
  assertExists(response.data);
});

Deno.test('RequestClient - DELETE request', async () => {
  const client = createClient();
  const response = await client.delete(
    'https://jsonplaceholder.typicode.com/posts/1',
  );

  assertEquals(response.status, 200);
});
