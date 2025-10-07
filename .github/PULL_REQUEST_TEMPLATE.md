## Description

<!-- Provide a brief description of what this PR does -->

## Branch Naming

<!-- Verify your branch follows the naming convention -->

**Branch name:** `<type>/<description>`

Supported types:
- `feat/*` - New features (minor version)
- `fix/*` - Bug fixes (patch version)
- `chore/*` - Enhancements (minor version)
- `refactor/*` - Code refactoring (patch version)
- `build/*` - Dependencies (patch version)
- `test/*` - Testing (patch version)
- `ci/*` - CI/CD changes (patch version)
- `docs/*` - Documentation
- `revert/*` - Reverts (patch version)

**Note:** Labels will be automatically applied based on your branch name.

## Related Issues

<!-- Link to related issues: Fixes #123, Relates to #456 -->

## Changes Made

<!-- List the main changes made in this PR -->

-
-
-

## Testing

<!-- Describe the tests you ran and how to reproduce them -->

- [ ] All existing unit tests pass (`deno task test:unit`)
- [ ] All existing spec tests pass (`deno task test:spec`)
- [ ] New tests added for new functionality
- [ ] Manual testing performed
- [ ] Coverage maintained or improved

### Test Details

<!-- Describe how you tested your changes -->

**Test commands run:**
```bash
deno task test:unit
deno task test:spec
```

## Checklist

<!-- Mark completed items with an 'x' -->

- [ ] My code follows the project's code style
- [ ] I have run `deno task fmt` to format my code
- [ ] I have run `deno task lint` and fixed any issues
- [ ] I have run `deno task check` for type checking
- [ ] I have run `deno task test:unit` and all tests pass
- [ ] I have run `deno task test:spec` and all tests pass
- [ ] My branch name follows the convention (`feat/*`, `fix/*`, etc.)
- [ ] I have updated the documentation (if necessary)
- [ ] I have added tests to cover my changes in `packages/client/spec/`
- [ ] All new and existing tests passed
- [ ] Code coverage is maintained or improved

## Additional Notes

<!-- Any additional information that reviewers should know -->
