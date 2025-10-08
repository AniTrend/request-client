# Examples

This directory contains example code demonstrating how to use `@anitrend/request-client` in various scenarios.

## Available Examples

### 1. `basic.ts` - Basic Usage

Demonstrates fundamental features of the request client including:
- Creating a client instance
- Making GET, POST, PUT, and DELETE requests
- Using query parameters
- Setting custom headers
- Error handling

**Run with Deno:**
```bash
deno run --allow-net examples/basic.ts
```

### 2. `interceptors.ts` - Interceptors

Shows how to use request, response, and error interceptors:
- Adding custom headers to requests
- Transforming response data
- Handling errors globally
- Logging requests and responses

**Run with Deno:**
```bash
deno run --allow-net examples/interceptors.ts
```

### 3. `node-compatibility.mjs` - Node.js Compatibility

Demonstrates running the package in Node.js environments:
- Setting up the package with JSR's npm compatibility
- Making requests from Node.js
- Using interceptors
- Error handling

**Prerequisites:**
- Node.js 18+ (required for native Fetch API)
- Install the package: `npx jsr add @anitrend/request-client`

**Run with Node.js:**
```bash
node examples/node-compatibility.mjs
```

## Testing Examples

All examples connect to `jsonplaceholder.typicode.com`, a free fake API for testing and prototyping. No authentication is required.

## Additional Resources

- [Main README](../README.md) - Full documentation
- [API Reference](../README.md#api-reference) - Complete API documentation
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute
