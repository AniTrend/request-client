# request-client

A tiny, dependency-free, axios-style fetch wrapper for Deno

[![JSR](https://jsr.io/badges/@anitrend/request-client)](https://jsr.io/@anitrend/request-client)
[![CI](https://github.com/AniTrend/request-client/actions/workflows/ci.yml/badge.svg)](https://github.com/AniTrend/request-client/actions/workflows/ci.yml)

## Features

- 🚀 **Axios-style API** - Familiar interface for HTTP requests
- 🎯 **Zero Dependencies** - Built on top of native Fetch API
- 📦 **TypeScript First** - Full type safety
- 🔄 **Interceptors** - Request, response, and error interceptors
- ⚙️ **Configuration** - Global and per-request configuration
- ⏱️ **Timeout Support** - Built-in request timeout handling
- 🎨 **Multiple Response Types** - JSON, text, blob, arrayBuffer

## Installation

### From JSR (Recommended)

```typescript
import { createClient } from 'jsr:@anitrend/request-client';
```

### From deno.land

```typescript
import { createClient } from 'https://deno.land/x/request_client/src/mod.ts';
```

## Quick Start

### Basic Usage

```typescript
import { createClient } from 'jsr:@anitrend/request-client';

// Create a client instance
const client = createClient();

// Make a GET request
const response = await client.get('https://api.example.com/users');
console.log(response.data);

// Make a POST request
const newUser = await client.post('https://api.example.com/users', {
  name: 'John Doe',
  email: 'john@example.com',
});
console.log(newUser.data);
```

### With Configuration

```typescript
import { createClient } from 'jsr:@anitrend/request-client';

const client = createClient({
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 seconds
});

// Now all requests use the baseURL
const users = await client.get('/users');
const user = await client.get('/users/1');
```

### Query Parameters

```typescript
const response = await client.get('/search', {
  params: {
    q: 'deno',
    limit: 10,
  },
});
// Requests: /search?q=deno&limit=10
```

### Request Interceptors

```typescript
client.interceptors.request.use((config) => {
  // Modify request config before sending
  config.headers = {
    ...config.headers,
    'X-Custom-Header': 'value',
  };
  return config;
});
```

### Response Interceptors

```typescript
client.interceptors.response.use((response) => {
  // Transform response data
  console.log('Response received:', response.status);
  return response;
});
```

### Error Handling

```typescript
import { RequestError } from 'jsr:@anitrend/request-client';

try {
  const response = await client.get('/endpoint');
} catch (error) {
  if (error instanceof RequestError) {
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
  }
}
```

## API Reference

### Creating a Client

```typescript
const client = createClient(config?: RequestConfig);
```

### RequestConfig

```typescript
interface RequestConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer';
  signal?: AbortSignal;
  validateStatus?: (status: number) => boolean;
}
```

### HTTP Methods

```typescript
// GET request
client.get<T>(url: string, config?: RequestConfig): Promise<RequestResponse<T>>

// POST request
client.post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<RequestResponse<T>>

// PUT request
client.put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<RequestResponse<T>>

// PATCH request
client.patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<RequestResponse<T>>

// DELETE request
client.delete<T>(url: string, config?: RequestConfig): Promise<RequestResponse<T>>

// HEAD request
client.head<T>(url: string, config?: RequestConfig): Promise<RequestResponse<T>>

// OPTIONS request
client.options<T>(url: string, config?: RequestConfig): Promise<RequestResponse<T>>
```

### RequestResponse

```typescript
interface RequestResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: RequestConfig;
}
```

## Development

### Prerequisites

- Deno 2.x or higher

### Running Tests

```bash
deno task test
```

### Linting

```bash
deno task lint
```

### Formatting

```bash
deno task fmt
```

### Type Checking

```bash
deno task check
```

## Contributing

Contributions are welcome! Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## License

Apache-2.0 License - see the [LICENSE](LICENSE) file for details
