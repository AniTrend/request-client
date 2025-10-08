# Copilot Instructions for request-client

## Project Overview

A zero-dependency, axios-style HTTP client for Deno built on native Fetch API. Published to JSR as `@anitrend/request-client`.

## Architecture Essentials

### Monorepo Structure
- **Workspace root**: `deno.json` defines workspace with `./packages`
- **Client package**: `packages/client/src/` - main request client code
- **Utils package**: `packages/utils/src/` - test helpers and mocks
- **Package config**: `packages/deno.json` extends root, exports `./client` and `./utils`

### Core Request Flow
```
User → RequestClient method → Request interceptors → Build URL/headers →
fetch() → Response interceptors → Process response → Return RequestResponse
```

Error path: `fetch() error → RequestError → Error interceptors → throw`

### Key Components
- **RequestClient** (`request.client.ts`): Main class with HTTP method wrappers
- **InterceptorManager** (`interceptors.ts`): Manages request/response/error interceptors
- **Types** (`types.ts`): `RequestConfig`, `RequestResponse<T>`, `RequestError`

## Development Commands

```bash
# Always run from workspace root
deno task test:unit        # Unit tests with coverage
deno task test:spec        # Specification tests
deno task test:watch       # Watch mode
deno task lint             # Lint checks
deno task fmt              # Auto-format code
deno task fmt:check        # Check formatting only
deno task check            # Type checking
deno task coverage         # Generate lcov.info
```

**Important**: Tests require `jsonplaceholder.typicode.com` access (configured in `deno.json` permissions).

## Code Conventions

### Imports
Use workspace aliases from `packages/deno.json`:
```typescript
import { createClient } from '@scope/packages/client';
import { mockHelper } from '@scope/packages/utils';
```

### Formatting (Enforced by `deno fmt`)
- Single quotes for strings
- 2-space indentation
- 80 character line width
- No semicolons
- No tabs

### Testing Patterns
- **Unit tests**: `*.test.ts` - test individual methods/functions
- **Spec tests**: `*.spec.ts` - integration tests against real API
- Place tests in `packages/client/spec/`
- Use `@std/testing/bdd` for describe/it blocks
- Mock fetch with `@c4spar/mock-fetch` for unit tests
- Spec tests use `jsonplaceholder.typicode.com`

Example test structure:
```typescript
import { assertEquals } from '@std/assert';
import { describe, it } from '@std/testing/bdd';

describe('Feature', () => {
  it('should behavior', async () => {
    // Arrange, Act, Assert
  });
});
```

## Branch Naming (Critical for Auto-labeling)

Branch names control PR labels and version bumps:
- `feat/*` → `:star2: feature` (minor bump)
- `fix/*` → `:adhesive_bandage: bug fix` (patch bump)
- `chore/*` → `:wrench: enhancement` (minor bump)
- `refactor/*` → `:hammer_and_wrench: refactor` (patch bump)
- `build/*` → `:dagger: dependencies` (patch bump)
- `test/*` → `:test_tube: testing` (patch bump)
- `ci/*` → `:construction_worker: ci` (patch bump)
- `docs/*` → `:books: docs` (patch bump)

Breaking changes: Manually add `:cactus: breaking` label for major bump.

## File Organization Rules

### Source Files
- **Main code**: `packages/client/src/`
- **Exports**: `packages/client/src/mod.ts` (public API)
- **Tests**: `packages/client/spec/`
- **Examples**: `examples/` directory

### What Gets Published (JSR)
Include: `packages/**/src`, `README.md`, `LICENSE`, `jsr.json`
Exclude: `**/*_test.ts`, `**/*.test.ts`

### Type Exports Pattern
Always export types from `mod.ts`:
```typescript
export { createClient, RequestClient } from './request.client.ts';
export { RequestError } from './types.ts';
export type { RequestConfig, RequestResponse } from './types.ts';
```

## Interceptor System

Three types managed by `InterceptorManager`:
```typescript
// Add interceptors
client.interceptors.request.use((config) => {
  // Modify config before request
  return config;
});

client.interceptors.response.use((response) => {
  // Transform response after request
  return response;
});

client.interceptors.error.use((error) => {
  // Handle errors
  return error; // Must return error, not throw
});
```

**Critical**: Interceptors execute in order added. Error interceptors receive `RequestError` instances.

## Common Patterns

### Adding New HTTP Features
1. Update `RequestConfig` interface in `types.ts`
2. Handle in `RequestClient.request()` method
3. Add unit tests in `spec/*.test.ts`
4. Add spec test in `spec/*.spec.ts`
5. Update examples if user-facing
6. Document in README.md

### Response Type Handling
Client supports: `json` (default), `text`, `blob`, `arrayBuffer`
```typescript
const response = await client.get<ArrayBuffer>('/file', {
  responseType: 'arrayBuffer'
});
```

### Timeout Implementation
Uses `AbortController` with `setTimeout`:
```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), timeout);
fetch(url, { signal: controller.signal });
```

## CI/CD Workflows

- **ci.yml**: Runs on push/PR - lint, format, test, coverage, multi-platform matrix
- **publish.yml**: Publishes to JSR on release (requires `id-token: write`)
- **quality.yml**: Dependency review + TODO/FIXME detection on PRs
- **release-drafter.yml**: Auto-drafts releases from merged PRs

## Common Pitfalls

1. **Don't use `console.log`** in source code - tests verify behavior, not logs
2. **Always await interceptors** - they can be async
3. **Test with mocks AND real API** - unit tests use mocks, spec tests use jsonplaceholder
4. **Respect 80-char limit** - enforced by formatter
5. **Export types separately** - `export type { ... }` for type-only exports
6. **Use absolute workspace paths** - examples use `@scope/packages/client`

## Documentation Sync

When changing public API:
1. Update `types.ts` JSDoc comments
2. Update README.md API Reference section
3. Update relevant example in `examples/`
4. Update ARCHITECTURE.md if structural change

## JSR Publishing Requirements

Maintain high JSR score (target: 95%+). Reference: https://jsr.io/docs/scoring

### Critical Rules

1. **Always use provenance**: `deno publish --provenance` in CI/CD
2. **No slow types**: Export types explicitly: `export type { Foo } from './types.ts'`
3. **Complete JSDoc**: All public APIs must have JSDoc with `@example` blocks
4. **Single config source**: Only root `deno.json` should have `name` and `version` fields
5. **Test before publish**: Run `deno publish --dry-run` + all tests before any release

### Required Metadata (jsr.json)

- `description`: Clear one-liner
- `keywords`: Array of relevant search terms
- `repository`: GitHub URL with `git+https://` prefix
- `license`: "Apache-2.0"
- `bugs` and `homepage`: GitHub URLs

### Publish Configuration (deno.json)

```json
"publish": {
  "include": ["packages/client/src/", "README.md", "LICENSE", "jsr.json", "deno.json"]
}
```

### Documentation Requirements

- Module-level `@module` JSDoc in `mod.ts`
- Runtime compatibility section in README (Deno, Node.js 18+, Bun)
- Examples for each major feature
- API reference with all public types/functions

