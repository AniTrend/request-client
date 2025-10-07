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
├── examples/                  # Usage examples
│   ├── basic.ts
│   └── interceptors.ts
│
├── src/                       # Source code
│   ├── client.ts             # Main RequestClient class
│   ├── client_test.ts        # Tests
│   ├── interceptors.ts       # Interceptor management
│   ├── mod.ts               # Public API exports
│   └── types.ts             # Type definitions
│
├── .cspell.json              # Spell checker config
├── .editorconfig             # Editor configuration
├── .gitignore                # Git ignore rules
├── CHANGELOG.md              # Version history
├── CODE_OF_CONDUCT.md        # Community guidelines
├── CONTRIBUTING.md           # Contribution guide
├── LICENSE                   # Apache-2.0 License
├── README.md                 # Project documentation
├── SECURITY.md               # Security policy
├── deno.json                 # Deno configuration
└── jsr.json                  # JSR package config
```

## Core Components

### RequestClient (`src/client.ts`)

The main class that provides an axios-style interface for making HTTP requests.

**Key Features:**
- Configuration management (baseURL, headers, timeout)
- HTTP method wrappers (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
- Interceptor support
- URL building with query parameters
- Response type handling
- Timeout management
- Error handling

### Types (`src/types.ts`)

Type definitions for the request client:
- `RequestConfig` - Configuration options
- `RequestResponse<T>` - Response structure
- `RequestError` - Custom error class

### Interceptors (`src/interceptors.ts`)

Manages request, response, and error interceptors:
- `RequestInterceptor` - Modify requests before sending
- `ResponseInterceptor` - Transform responses
- `ErrorInterceptor` - Handle errors
- `InterceptorManager` - Manage interceptor lifecycle

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

Tests are colocated with source files using the `*_test.ts` naming convention.

**Test Coverage:**
- Unit tests for all public methods
- HTTP method tests (GET, POST, PUT, PATCH, DELETE)
- Configuration tests
- Interceptor tests
- Error handling tests
- Timeout tests

## CI/CD Pipeline

### Continuous Integration (ci.yml)

1. **Lint Check** - Code style validation
2. **Format Check** - Code formatting validation
3. **Type Check** - TypeScript type validation
4. **Unit Tests** - Run test suite
5. **Test Matrix** - Multi-platform testing

### Publishing (publish.yml)

1. Run all tests
2. Run linting
3. Run format check
4. Publish to JSR (on release or manual trigger)

### Quality Checks (quality.yml)

1. Dependency review
2. TODO/FIXME detection
3. Spell checking

## Configuration Files

### deno.json

Main Deno configuration:
- Lint rules
- Format settings
- Tasks (test, lint, fmt, check)
- Test configuration
- Publish settings

### jsr.json

JSR package metadata:
- Package name: `@anitrend/request-client`
- Version
- Exports

## Development Workflow

1. **Setup**: Install Deno
2. **Development**: Make changes
3. **Testing**: `deno task test`
4. **Linting**: `deno task lint`
5. **Formatting**: `deno task fmt`
6. **Type Check**: `deno task check`
7. **Commit**: Follow conventional commits
8. **PR**: Create pull request
9. **Review**: Automated checks + manual review
10. **Merge**: Merge to main
11. **Release**: Automated release draft
12. **Publish**: Publish to JSR

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
