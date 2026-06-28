# AGENTS.md — request-client

## Project Overview

A zero-dependency, axios-style HTTP client for Deno built on native Fetch API. Published to JSR as `@anitrend/request-client`.

## Toolchain

- **Deno 2.x only.** No Node.js, npm, pnpm, or yarn for development.
- All commands are `deno task` tasks defined in `deno.json`.
- VS Code: install the Deno extension (`denoland.vscode-deno`). Workspace `settings.json` already enables it with `deno.enable: true`.

## Commands

```sh
deno task check       # Type-check the entrypoint (packages/client/src/mod.ts)
deno task test:unit   # Unit tests with coverage (packages/**/*.test.ts)
deno task test:spec   # Spec/integration tests with coverage (packages/**/*.spec.ts)
deno task test:watch  # Watch mode
deno task lint        # Deno lint
deno task fmt         # Format code
deno task fmt:check   # Check formatting (no writes — CI style)
deno task coverage    # Generate coverage/lcov.info
```

Tests use `-P` (`--allow-read`) implicitly plus network restricted to `jsonplaceholder.typicode.com` (see `deno.json` `test.permissions`).

## Architecture

### Monorepo Structure

- **Monorepo workspace** with one active package: `packages/client/`.
- **Entrypoint**: `packages/client/src/mod.ts` (also the export path in `jsr.json` and `deno.json`).
- Source files: `request.client.ts` (main class + `createClient`), `types.ts`, `interceptors.ts`.
- Tests live in `packages/client/spec/`. Mock helper is `mock.helper.ts` in the same directory (no separate `packages/utils/` — that directory no longer exists).
- Examples are in `examples/` and import via `@scope/packages/client` (workspace alias), not the JSR name.
- Zero runtime dependencies. Test deps from JSR: `@c4spar/mock-fetch`, `@std/assert`, `@std/testing`.

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

### Interceptor System

Three interceptor types managed by `InterceptorManager`:

```typescript
// Request interceptors — modify config before fetch
client.interceptors.request.use((config) => {
  return config
})

// Response interceptors — transform response after fetch
client.interceptors.response.use((response) => {
  return response
})

// Error interceptors — handle errors (must return error, not throw)
client.interceptors.error.use((error) => {
  return error
})
```

**Critical**: Interceptors execute in registration order. Error interceptors receive `RequestError` instances.

## Code Style

Enforced by `deno fmt` and `deno lint`:
- 2-space indent, single quotes, no semicolons
- Max line width 80 characters
- LF line endings, trailing newline at EOF
- Formatter applies to `packages/` only (excludes `.github/`, `coverage/`, `build/`, `README.md`)

## Code Conventions

### Imports

Use workspace aliases from `deno.json`:

```typescript
// Library code
import { createClient } from '@anitrend/request-client'

// Examples
import { createClient } from '@scope/packages/client'
```

### Testing Patterns

- **Unit tests**: `*.test.ts` — test individual methods/functions with mocked fetch
- **Spec tests**: `*.spec.ts` — integration tests against `jsonplaceholder.typicode.com`
- Place tests in `packages/client/spec/`
- Use `@std/testing/bdd` for `describe`/`it` blocks
- Mock fetch with `@c4spar/mock-fetch` for unit tests
- Test imports use `@anitrend/request-client` (JSR name mapped in `deno.json` imports), not relative imports

```typescript
import { assertEquals } from '@std/assert'
import { describe, it } from '@std/testing/bdd'

describe('Feature', () => {
  it('should behave correctly', async () => {
    // Arrange, Act, Assert
  })
})
```

### Adding New HTTP Features

1. Update `RequestConfig` interface in `types.ts`
2. Handle in `RequestClient.request()` method
3. Add unit tests in `packages/client/spec/`
4. Add spec test in `packages/client/spec/`
5. Update examples if user-facing
6. Document in `README.md`

### Response Type Handling

Client supports: `json` (default), `text`, `blob`, `arrayBuffer`:

```typescript
const response = await client.get<ArrayBuffer>('/file', {
  responseType: 'arrayBuffer',
})
```

### Timeout Implementation

Uses `AbortController` with `setTimeout`:

```typescript
const controller = new AbortController()
setTimeout(() => controller.abort(), timeout)
fetch(url, { signal: controller.signal })
```

### Type Exports Pattern

Always export types explicitly from `mod.ts`:

```typescript
export { createClient, RequestClient } from './request.client.ts'
export { RequestError } from './types.ts'
export type { RequestConfig, RequestResponse } from './types.ts'
```

### Common Pitfalls

1. **Don't use `console.log`** in source code — tests verify behavior, not logs
2. **Always await interceptors** — they can be async
3. **Test with mocks AND real API** — unit tests use mocks, spec tests use jsonplaceholder
4. **Respect 80-char limit** — enforced by formatter
5. **Export types separately** — `export type { ... }` for type-only exports
6. **Use workspace import paths in examples** — `@scope/packages/client`

## CI

- **PR CI** (`ci.yml`): changes filter → lint → format → type-check → unit-test. Test matrix (ubuntu/macos/windows) runs only on pushes to `main`.
- **Quality** (`quality.yml`): dependency review + TODO/FIXME/XXX detection in `packages/` (non-blocking `continue-on-error`).
- **Publish** (`publish.yml`): triggers on GitHub Release or manual dispatch. Gated by lint → format → type-check → unit-test → `deno publish`.
- **Release Drafter**: auto-drafts release notes. Also auto-bumps version in `jsr.json` and `deno.json` via a bot PR on merge to `main`.

## Branch & Version Conventions

- Branch naming controls automatic PR labels and semver bumps (via Release Drafter autolabeler):
  `feat/*` → feature (minor), `fix/*` → bug fix (patch), `chore/*` → enhancement (minor), `refactor/*` → refactor (patch), `build/*` → dependencies (patch), `test/*` → testing (patch), `ci/*` → CI (patch), `docs/*` → docs (no version bump), `revert/*` → revert (patch)
- **Breaking changes**: Manually add `breaking` label for major bump.
- Version lives in **both** `jsr.json` and `deno.json`. They must stay in sync. Release Drafter handles this automatically — do not manually bump version in a PR unless you know what you're doing.

## Publishing

- Package name: `@anitrend/request-client`
- Registry: JSR. Only `packages/client/src/`, `README.md`, `LICENSE`, `jsr.json`, `deno.json` are included in the publish.
- `deno.lock` is gitignored — never commit it.

### Publish Configuration

```json
"publish": {
  "include": [
    "packages/client/src/",
    "README.md",
    "LICENSE",
    "jsr.json",
    "deno.json"
  ]
}
```

### Required Metadata (`jsr.json`)

- `description`: Clear one-liner
- `keywords`: Array of relevant search terms
- `repository`: GitHub URL with `git+https://` prefix
- `license`: "Apache-2.0"
- `bugs` and `homepage`: GitHub URLs

### JSR Scoring (target: 95%+)

Reference: https://jsr.io/docs/scoring

- **Always use provenance**: `deno publish --provenance` in CI/CD
- **No slow types**: Export types explicitly: `export type { Foo } from './types.ts'`
- **Complete JSDoc**: All public APIs must have JSDoc with `@example` blocks
- **Single config source**: Only root `deno.json` should have `name` and `version` fields
- **Test before publish**: Run `deno publish --dry-run` + all tests before any release

### Documentation Requirements

- Module-level `@module` JSDoc in `mod.ts`
- Runtime compatibility section in README (Deno, Node.js 18+, Bun)
- Examples for each major feature
- API reference with all public types/functions

## Documentation Sync

When changing public API:
1. Update `types.ts` JSDoc comments
2. Update `README.md` API Reference section
3. Update relevant example in `examples/`
4. Update `ARCHITECTURE.md` if structural change

## Gotchas

- `ARCHITECTURE.md` references `packages/utils/` but that directory no longer exists. `mock.helper.ts` is at `packages/client/spec/mock.helper.ts`.
- The `test:unit` and `test:spec` tasks both write coverage to `coverage/`. Run `test:spec` after `test:unit` only if you want merged coverage, otherwise the second run overwrites.
- Test imports use `@anitrend/request-client` (the JSR name mapped in `deno.json` imports), not relative imports.
