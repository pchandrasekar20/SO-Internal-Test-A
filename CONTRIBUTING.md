# Contributing Guide

Thank you for considering contributing to this project! This guide will help you understand our development workflow and standards.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fullstack-ts-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. **Start services**
   ```bash
   # Terminal 1: PostgreSQL
   docker-compose up -d

   # Terminal 2: Backend
   pnpm run dev --filter=backend

   # Terminal 3: Frontend
   pnpm run dev --filter=frontend
   ```

## Code Standards

### TypeScript

- Use strict TypeScript (`strict: true`)
- Avoid `any` types - use proper typing
- Use explicit return types for functions
- Prefer interfaces over types for object shapes

### Naming Conventions

- **Files**: Use kebab-case (e.g., `user-service.ts`)
- **Functions/Variables**: Use camelCase (e.g., `getUserById`)
- **Classes/Types**: Use PascalCase (e.g., `UserService`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **CSS Classes**: Use kebab-case (e.g., `user-card`)

### Code Style

- Line length: 100 characters max
- Indentation: 2 spaces
- Quotes: Single quotes
- Semicolons: Always include
- Trailing commas: ES5 style

Run Prettier to enforce these automatically:
```bash
pnpm format
```

### Linting

All code must pass ESLint:
```bash
pnpm lint
```

Fix auto-fixable issues:
```bash
pnpm lint -- --fix
```

## Commit Guidelines

Use conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only
- `style`: Changes that don't affect code meaning (formatting, missing semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding or updating tests
- `chore`: Changes to build process, dependencies, or tools

**Examples**:
```
feat(auth): add JWT token refresh mechanism
fix(api): correct user endpoint response format
docs(readme): update installation instructions
test(backend): add user service tests
chore(deps): upgrade typescript to 5.3.3
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feat/feature-name
   ```

2. **Make your changes**
   - Keep commits atomic and descriptive
   - Update tests as needed
   - Update documentation if applicable

3. **Run quality checks**
   ```bash
   pnpm lint
   pnpm format:check
   pnpm type-check
   pnpm test
   ```

4. **Commit and push**
   ```bash
   git commit -m "feat(scope): description"
   git push origin feat/feature-name
   ```

5. **Create a pull request**
   - Use a descriptive title
   - Include what changes were made and why
   - Link to related issues (fixes #123)
   - Ensure CI passes

6. **Code review**
   - Address feedback from reviewers
   - Make additional commits as needed
   - Keep the PR focused on a single feature/fix

## Testing Requirements

- Write tests for new features
- Ensure existing tests still pass
- Aim for >80% coverage on critical paths
- Use descriptive test names

### Backend Tests
```bash
pnpm run test --filter=backend
```

### Frontend Tests
```bash
pnpm run test --filter=frontend
```

## Documentation

When adding new features:

1. Update relevant code comments
2. Update the README if it's user-facing
3. Add JSDoc comments to exported functions
4. Update API documentation

## Performance Considerations

- Profile before optimizing
- Consider bundle size impact
- Monitor database queries
- Implement proper caching strategies

## Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate and sanitize user input
- Keep dependencies up to date
- Report security issues privately

## Getting Help

- Check existing issues and PRs
- Ask questions in PR comments or discussions
- Reach out to maintainers if stuck

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
