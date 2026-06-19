# AGENTS.md — request-client

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

- **Monorepo workspace** with one active package: `packages/client/`.
- **Entrypoint**: `packages/client/src/mod.ts` (also the export path in `jsr.json` and `deno.json`).
- Source files: `request.client.ts` (main class + `createClient`), `types.ts`, `interceptors.ts`.
- Tests live in `packages/client/spec/`. Mock helper is `mock.helper.ts` in the same directory (not in a separate `packages/utils/` — that directory no longer exists, despite `ARCHITECTURE.md` mentioning it).
- Examples are in `examples/` and import via `@scope/packages/client` (workspace alias), not the JSR name.
- Zero runtime dependencies. Test deps from JSR: `@c4spar/mock-fetch`, `@std/assert`, `@std/testing`.

## Code Style

Enforced by `deno fmt` and `deno lint`:
- 2-space indent, single quotes, no semicolons
- Max line width 80 characters
- LF line endings, trailing newline at EOF
- Formatter applies to `packages/` only (excludes `.github/`, `coverage/`, `build/`, `README.md`)

## CI

- **PR CI** (`ci.yml`): changes filter → lint → format → type-check → unit-test. Test matrix (ubuntu/macos/windows) runs only on pushes to `main`.
- **Quality** (`quality.yml`): dependency review + TODO/FIXME/XXX detection in `packages/` (non-blocking `continue-on-error`).
- **Publish** (`publish.yml`): triggers on GitHub Release or manual dispatch. Gated by lint → format → type-check → unit-test → `deno publish`.
- **Release Drafter**: auto-drafts release notes. Also auto-bumps version in `jsr.json` and `deno.json` via a bot PR on merge to `main`.

## Branch & Version Conventions

- Branch naming controls automatic PR labels and semver bumps (via Release Drafter autolabeler):
  `feat/*` → feature (minor), `fix/*` → bug fix (patch), `chore/*` → enhancement (minor), `refactor/*` → refactor (patch), `build/*` → dependencies (patch), `test/*` → testing (patch), `ci/*` → CI (patch), `docs/*` → docs (no version bump), `revert/*` → revert (patch)
- Version lives in **both** `jsr.json` and `deno.json`. They must stay in sync. Release Drafter handles this automatically — do not manually bump version in a PR unless you know what you're doing.

## Publishing

- Package name: `@anitrend/request-client`
- Registry: JSR. Only `packages/client/src/`, `README.md`, `LICENSE`, `jsr.json`, `deno.json` are included in the publish.
- `deno.lock` is gitignored — never commit it.

## Gotchas

- `ARCHITECTURE.md` references `packages/utils/` but that directory no longer exists. `mock.helper.ts` is at `packages/client/spec/mock.helper.ts`.
- The `test:unit` and `test:spec` tasks both write coverage to `coverage/`. Run `test:spec` after `test:unit` only if you want merged coverage, otherwise the second run overwrites.
- Test imports use `@anitrend/request-client` (the JSR name mapped in `deno.json` imports), not relative imports.
