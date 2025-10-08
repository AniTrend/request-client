# Contributing to request-client

Thank you for your interest in contributing to request-client! We welcome contributions from everyone.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) v2.x or higher

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/request-client.git
   cd request-client
   ```

3. Create a new branch following the naming convention:
   ```bash
   # For new features
   git checkout -b feat/your-feature-name

   # For bug fixes
   git checkout -b fix/your-bug-fix

   # For enhancements/chores
   git checkout -b chore/your-enhancement

   # For refactoring
   git checkout -b refactor/your-refactor

   # For documentation
   git checkout -b docs/your-docs-update

   # For tests
   git checkout -b test/your-test-addition

   # For CI/CD changes
   git checkout -b ci/your-ci-update
   ```

## Development Workflow

### Running Tests

```bash
# Run all unit tests
deno task test:unit

# Run specification tests
deno task test:spec

# Run tests in watch mode
deno task test:watch
```

### Coverage Reports

```bash
# Generate LCOV coverage report
deno task coverage

# View HTML coverage report
open coverage/html/index.html
```

### Linting

```bash
deno task lint
```

### Formatting

```bash
# Format code
deno task fmt

# Check formatting without making changes
deno task fmt:check
```

### Type Checking

```bash
deno task check
```

## Branch Naming Convention

Branch names are used for automatic labeling in the release process. Follow these conventions:

- `feat/*` - New features (labels: `:star2: feature`)
- `fix/*` - Bug fixes (labels: `:adhesive_bandage: bug fix`)
- `chore/*` - Enhancements (labels: `:wrench: enhancement`)
- `refactor/*` - Code refactoring (labels: `:hammer_and_wrench: refactor`)
- `build/*` - Dependencies (labels: `:dagger: dependencies`)
- `test/*` - Testing (labels: `:test_tube: testing`)
- `ci/*` - CI/CD changes (labels: `:construction_worker: ci`)
- `docs/*` - Documentation (labels: `:books: docs`)
- `revert/*` - Reverts (labels: `:rewind: revert`)

These labels affect version resolution:
- **Major**: Breaking changes (`:cactus: breaking`)
- **Minor**: Features and enhancements
- **Patch**: Bug fixes, dependencies, refactors, tests, CI changes

## Making Changes

1. Make your changes in a new branch following the naming convention
2. Add or update tests as necessary
3. Ensure all tests pass (`deno task test:unit` and `deno task test:spec`)
4. Ensure code is properly formatted and linted
5. Update documentation if needed
6. Source files are located in `packages/client/src/`

## Submitting Changes

1. Push your changes to your fork
2. Create a pull request from your fork to our `main` branch
3. Describe your changes in the pull request description
4. Link any related issues

### Pull Request Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation for API changes
- Keep pull requests focused on a single feature or fix

## Testing

We strive for high test coverage. When adding new features:

1. Add unit tests in `packages/client/spec/` directory
   - Use `*.test.ts` suffix for unit tests
   - Use `*.spec.ts` suffix for specification tests
2. Ensure tests cover edge cases
3. Use descriptive test names
4. Tests should be independent and not rely on execution order
5. Mock external dependencies using `@c4spar/mock-fetch`
6. Ensure all tests pass before submitting a PR
7. Maintain or improve code coverage

## Code Style

This project uses Deno's built-in formatter and linter with the following conventions:

- Use 2 spaces for indentation
- Maximum line length of 80 characters
- Use single quotes for strings
- No semicolons at the end of statements

These rules are enforced automatically by `deno fmt` and `deno lint`.

## Commit Messages

Write clear and descriptive commit messages following conventional commits:

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant
- Your branch name will automatically apply labels to PRs

Example:
```
feat: add timeout support for requests

- Implement timeout configuration in RequestConfig
- Add timeout handling in request method
- Add tests for timeout functionality

Fixes #123
```

Example branch and commit combinations:
```
# Branch: feat/timeout-support
# Commit: feat: add timeout support for requests
# Result: Labeled as :star2: feature, minor version bump

# Branch: fix/header-bug
# Commit: fix: resolve header merge issue
# Result: Labeled as :adhesive_bandage: bug fix, patch version bump
```

## Release Process

Releases are handled by maintainers:

1. Version is updated in `jsr.json` and `deno.json`
2. Release notes are generated automatically
3. Package is published to JSR

## Questions?

Feel free to open an issue for any questions or concerns.

## License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 License.
