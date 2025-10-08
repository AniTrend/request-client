# Architecture

## Project Structure

```
request-client/
├── .github/                    # GitHub-specific files
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── workflows/             # GitHub Actions workflows
│   │   ├── ci.yml            # Continuous Integration
│   │   ├── publish.yml       # JSR Publishing
│   │   ├── quality.yml       # Quality checks
│   │   └── release-drafter.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── release-drafter-config.yml
│
├── .vscode/                   # VS Code configuration
│   ├── extensions.json       # Recommended extensions
│   └── settings.json         # Workspace settings
│
├── coverage/                  # Test coverage reports
│   ├── html/                 # HTML coverage reports
│   └── lcov.info            # LCOV format for CI
│
├── examples/                  # Usage examples
│   ├── basic.ts
│   └── interceptors.ts
│
├── packages/                  # Workspace packages
│   ├── deno.json             # Package-specific config
│   ├── client/               # Request client package
│   │   ├── spec/             # Test specifications
│   │   │   ├── request.client.spec.ts
│   │   │   └── request.client.test.ts
│   │   └── src/              # Source code
│   │       ├── interceptors.ts    # Interceptor management
│   │       ├── mod.ts            # Public API exports
│   │       ├── request.client.ts # Main RequestClient class
│   │       └── types.ts          # Type definitions
│   └── utils/                # Utility packages
│       ├── spec/
│       └── src/
│           ├── mock.helper.ts    # Test utilities
│           └── mod.ts
│
├── .editorconfig             # Editor configuration
├── .gitignore                # Git ignore rules
├── ARCHITECTURE.md           # Architecture documentation
├── CODE_OF_CONDUCT.md        # Community guidelines
├── CONTRIBUTING.md           # Contribution guide
├── LICENSE                   # Apache-2.0 License
├── README.md                 # Project documentation
├── SECURITY.md               # Security policy
├── deno.json                 # Deno workspace configuration
└── jsr.json                  # JSR package config
```

## Core Components

### RequestClient (`packages/client/src/request.client.ts`)

The main class that provides an axios-style interface for making HTTP requests.

**Key Features:**
- Configuration management (baseURL, headers, timeout)
- HTTP method wrappers (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
- Interceptor support
- URL building with query parameters
- Response type handling
- Timeout management
- Error handling

### Types (`packages/client/src/types.ts`)

Type definitions for the request client:
- `RequestConfig` - Configuration options
- `RequestResponse<T>` - Response structure
- `RequestError` - Custom error class

### Interceptors (`packages/client/src/interceptors.ts`)

Manages request, response, and error interceptors:
- `RequestInterceptor` - Modify requests before sending
- `ResponseInterceptor` - Transform responses
- `ErrorInterceptor` - Handle errors
- `InterceptorManager` - Manage interceptor lifecycle

### Test Utilities (`packages/utils/src/mock.helper.ts`)

Utility functions for testing:
- Mock helpers for testing HTTP requests
- Test utilities for interceptors

## Request Flow

```
User Code
   ↓
RequestClient Method (get, post, etc.)
   ↓
Request Interceptors
   ↓
Build URL & Headers
   ↓
Native Fetch API
   ↓
Response Interceptors
   ↓
Process Response
   ↓
Return RequestResponse
```

## Error Flow

```
Error Occurs
   ↓
Create RequestError
   ↓
Error Interceptors
   ↓
Throw to User Code
```

## Testing Strategy

Tests are organized in the `packages/client/spec/` directory with two types of test files:
- `*.test.ts` - Unit tests (run with `deno task test:unit`)
- `*.spec.ts` - Specification tests (run with `deno task test:spec`)

**Test Coverage:**
- Unit tests for all public methods
- HTTP method tests (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
- Configuration tests
- Interceptor tests
- Error handling tests
- Timeout tests
- Coverage reports generated in `coverage/` directory
- LCOV format reports for CI integration

## CI/CD Pipeline

### Continuous Integration (ci.yml)

Runs on push to `main` and pull requests:

1. **Lint Check** - Code style validation with Deno lint
2. **Format Check** - Code formatting validation
3. **Type Check** - TypeScript type validation
4. **Unit Tests** - Run test suite with coverage
5. **Coverage Upload** - Upload to Codecov
6. **Test Matrix** - Multi-platform testing (Ubuntu, macOS, Windows) with Deno v1.x and v2.x

### Publishing (publish.yml)

Triggers on release or manual dispatch:

1. Run unit tests
2. Run linting
3. Run format check
4. Dry-run option for testing
5. Publish to JSR with proper permissions (id-token: write)

### Quality Checks (quality.yml)

Runs on pull requests:

1. **Dependency Review** - Check for vulnerable dependencies
2. **TODO/FIXME Detection** - Detect unresolved comments

### Release Drafter (release-drafter.yml)

Automatically drafts releases based on merged PRs and labels

## Configuration Files

### deno.json

Main Deno workspace configuration:
- **Workspace**: Monorepo setup with `./packages`
- **Lint**: Includes `packages/`, excludes `.github/`, `README.md`, `build/`, `coverage/`
- **Format**: Single quotes, 2-space indentation, 80 character line width
- **Tasks**:
  - `check` - Type checking
  - `test:unit` - Run unit tests with coverage
  - `test:spec` - Run specification tests
  - `test:watch` - Watch mode for tests
  - `lint` - Run linter
  - `fmt` - Format code
  - `fmt:check` - Check formatting
  - `coverage` - Generate LCOV coverage report
- **Permissions**: Network access to `jsonplaceholder.typicode.com` for tests
- **Imports**: Test dependencies from JSR
  - `@c4spar/mock-fetch` - Mock fetch for testing
  - `@std/assert` - Assertions
  - `@std/testing` - Testing utilities

### jsr.json

JSR package metadata:
- Package name: `@anitrend/request-client`
- Version: `0.1.0`
- Exports: `./packages/client/src/mod.ts`

## Development Workflow

1. **Setup**: Install Deno 2.x or higher
2. **Branch**: Create a feature branch following naming conventions:
   - `feat/<feature-name>` - New features
   - `fix/<bug-name>` - Bug fixes
   - `chore/<task-name>` - Enhancements
   - `refactor/<name>` - Code refactoring
   - `build/<name>` - Dependencies
   - `test/<name>` - Testing
   - `ci/<name>` - CI/CD changes
   - `docs/<name>` - Documentation
   - `revert/<name>` - Reverts
3. **Development**: Make changes in `packages/client/src/`
4. **Testing**:
   - `deno task test:unit` - Run unit tests
   - `deno task test:spec` - Run spec tests
   - `deno task test:watch` - Watch mode
5. **Linting**: `deno task lint`
6. **Formatting**: `deno task fmt` or `deno task fmt:check`
7. **Type Check**: `deno task check`
8. **Coverage**: `deno task coverage`
9. **Commit**: Follow conventional commits
10. **PR**: Create pull request with proper labels
11. **Review**: Automated checks + manual review
12. **Merge**: Merge to main
13. **Release**: Automated release draft created
14. **Publish**: Publish to JSR on release

## Design Decisions

### Why Deno?

- Modern JavaScript/TypeScript runtime
- Native TypeScript support
- Secure by default
- Standard library
- Built-in tooling (fmt, lint, test)

### Why Axios-style API?

- Familiar to developers
- Intuitive method names
- Flexible configuration
- Interceptor pattern

### Why Zero Dependencies?

- Smaller package size
- Faster installation
- Fewer security vulnerabilities
- Easier maintenance
- Better performance

### Why JSR?

- Modern package registry for TypeScript
- Native Deno support
- Better documentation
- Faster publishing
- Improved developer experience
