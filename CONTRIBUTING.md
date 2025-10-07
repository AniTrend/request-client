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

3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Tests

```bash
deno task test
```

### Watch Mode

```bash
deno task test:watch
```

### Linting

```bash
deno task lint
```

### Formatting

```bash
deno task fmt
```

To check formatting without making changes:
```bash
deno task fmt:check
```

### Type Checking

```bash
deno task check
```

## Making Changes

1. Make your changes in a new branch
2. Add or update tests as necessary
3. Ensure all tests pass
4. Ensure code is properly formatted and linted
5. Update documentation if needed

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

1. Add unit tests in the same directory as the source file (e.g., `client_test.ts`)
2. Ensure tests cover edge cases
3. Use descriptive test names

## Code Style

This project uses Deno's built-in formatter and linter with the following conventions:

- Use 2 spaces for indentation
- Maximum line length of 80 characters
- Use single quotes for strings
- No semicolons at the end of statements

These rules are enforced automatically by `deno fmt` and `deno lint`.

## Commit Messages

Write clear and descriptive commit messages:

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

Example:
```
Add timeout support for requests

- Implement timeout configuration in RequestConfig
- Add timeout handling in request method
- Add tests for timeout functionality

Fixes #123
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
