import { assertEquals, assertExists } from '@std/assert';
import { describe, it } from '@std/testing/bdd';
import {
  createClient,
  RequestClient,
  RequestError,
} from '@scope/packages/client';

describe('RequestClient Spec', () => {
  describe('createClient', () => {
    it('should create a client instance', () => {
      const client = createClient();
      assertExists(client);
      assertEquals(client instanceof RequestClient, true);
    });

    it('should create a client with config', () => {
      const client = createClient({
        baseURL: 'https://api.example.com',
        headers: {
          'Authorization': 'Bearer token',
        },
      });
      assertExists(client);
    });
  });

  describe('HTTP Methods', () => {
    it('should make a GET request', async () => {
      const client = createClient();
      const response = await client.get(
        'https://jsonplaceholder.typicode.com/posts/1',
      );

      assertEquals(response.status, 200);
      assertExists(response.data);
      assertExists(response.headers);
    });

    it('should make a POST request', async () => {
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

    it('should make a PUT request', async () => {
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

    it('should make a PATCH request', async () => {
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

    it('should make a DELETE request', async () => {
      const client = createClient();
      const response = await client.delete(
        'https://jsonplaceholder.typicode.com/posts/1',
      );

      assertEquals(response.status, 200);
    });
  });

  describe('Configuration', () => {
    it('should work with baseURL', async () => {
      const client = createClient({
        baseURL: 'https://jsonplaceholder.typicode.com',
      });
      const response = await client.get('/posts/1');

      assertEquals(response.status, 200);
      assertExists(response.data);
    });

    it('should work with query params', async () => {
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

    it('should work with custom headers', async () => {
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

    it('should handle timeout', async () => {
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
  });

  describe('Error Handling', () => {
    it('should handle errors', async () => {
      const client = createClient();

      try {
        await client.get(
          'https://jsonplaceholder.typicode.com/posts/99999999999',
        );
      } catch (error) {
        assertEquals(error instanceof RequestError, true);
      }
    });
  });

  describe('Interceptors', () => {
    it('should apply request interceptor', async () => {
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

    it('should apply response interceptor', async () => {
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
  });
});
