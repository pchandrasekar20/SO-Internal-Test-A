# Full Stack TypeScript Application

A modern, full-stack TypeScript monorepo with a backend API, frontend application, and PostgreSQL database. Built with best practices for scalability, maintainability, and developer experience.

## 🏗️ Project Structure

```
.
├── backend/                 # Express.js backend API
│   ├── src/
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example        # Environment variables template
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── main.tsx        # Application entry point
│   │   └── App.tsx         # Root component
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example        # Environment variables template
├── database/               # Database schema and seeds
│   ├── init.sql            # Schema initialization
│   └── seed.sql            # Sample data
├── docker-compose.yml      # PostgreSQL service
├── package.json            # Root workspace configuration
├── pnpm-workspace.yaml     # Workspace definition
├── tsconfig.json           # Base TypeScript configuration
├── .eslintrc.json          # Linting configuration
└── .prettierrc.json        # Code formatting configuration
```

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher ([install](https://pnpm.io/installation))
- **Docker & Docker Compose**: For PostgreSQL service

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

### 2. Set Up Environment Variables

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env
```

Edit the `.env` files with your configuration:

**Backend (.env)**:
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fullstack_app
DB_USER=postgres
DB_PASSWORD=postgres
FINNHUB_API_KEY=your_api_key_here
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**:
```
VITE_API_BASE_URL=http://localhost:3001
VITE_NODE_ENV=development
```

### 3. Start PostgreSQL

```bash
# Start the PostgreSQL service (initializes schema and seeds data)
docker-compose up -d
```

The database will be automatically initialized with tables for users, stocks, and relationships.

### 4. Run Development Servers

**Terminal 1 - Backend**:
```bash
pnpm run dev --filter=backend
```

Backend will start at `http://localhost:3001`

**Terminal 2 - Frontend**:
```bash
pnpm run dev --filter=frontend
```

Frontend will start at `http://localhost:3000`

## 📦 Workspace Scripts

Run from the root directory:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm build` | Build all workspaces |
| `pnpm test` | Run tests in all workspaces |
| `pnpm lint` | Run ESLint on all workspaces |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm type-check` | Run TypeScript type checking |

Run workspace-specific scripts:

```bash
# Backend
pnpm run dev --filter=backend
pnpm run build --filter=backend
pnpm run test --filter=backend

# Frontend
pnpm run dev --filter=frontend
pnpm run build --filter=frontend
pnpm run test --filter=frontend
```

## 🗄️ Database

### Schema

The database includes three main tables:

- **users**: User accounts with email and name
- **stocks**: Stock symbols and pricing information (Finnhub integration ready)
- **user_stocks**: Many-to-many relationship for user favorites

### Managing the Database

```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# Stop PostgreSQL and remove data
docker-compose down -v

# View logs
docker-compose logs postgres

# Connect to database
docker exec -it fullstack-app-db psql -U postgres -d fullstack_app
```

## 🔧 Development Workflow

### Code Style

- **Language**: TypeScript
- **Formatter**: Prettier (2 spaces, single quotes)
- **Linter**: ESLint with TypeScript support
- **Testing**: Vitest (Node.js for backend, jsdom for frontend)

### Before Committing

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check

# Run linter
pnpm lint

# Run type checking
pnpm type-check

# Run tests
pnpm test
```

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Run checks: `pnpm lint && pnpm type-check && pnpm test`
4. Push and create a pull request

## 🛠️ Backend

### Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with pg driver
- **Development**: tsx for hot-reloading
- **Testing**: Vitest

### API Endpoints

- `GET /`: Health check

### Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: PostgreSQL configuration
- `FINNHUB_API_KEY`: Finnhub API key for stock data
- `FRONTEND_URL`: CORS origin for frontend

### Adding New Routes

Create route files in `backend/src/routes/` and import them in `index.ts`:

```typescript
import express from 'express';

const router = express.Router();

router.get('/endpoint', (req, res) => {
  res.json({ data: 'response' });
});

export default router;
```

## 🎨 Frontend

### Stack

- **Framework**: React 18
- **Bundler**: Vite
- **Language**: TypeScript
- **Testing**: Vitest with jsdom
- **Styling**: CSS (extend with Tailwind, styled-components, etc. as needed)

### Project Setup

- `src/main.tsx`: Entry point
- `src/App.tsx`: Root component
- `index.html`: HTML template

### Building for Production

```bash
pnpm run build --filter=frontend
```

Output will be in `frontend/dist/`

## 🐳 Docker Compose

The `docker-compose.yml` includes:

- **PostgreSQL 16**: Database service with health checks
- **Auto-initialization**: Runs `init.sql` and `seed.sql` on first start
- **Data persistence**: Named volume for database data

## 📝 Environment Variables

### Backend (.env)

```
# Server
PORT=3001
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fullstack_app
DB_USER=postgres
DB_PASSWORD=postgres

# External APIs
FINNHUB_API_KEY=your_finnhub_api_key

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```
# API
VITE_API_BASE_URL=http://localhost:3001
VITE_NODE_ENV=development
```

## 🧪 Testing

### Backend Tests

```bash
pnpm run test --filter=backend
```

Tests go in `backend/src/__tests__/` with `.test.ts` or `.spec.ts` extensions.

### Frontend Tests

```bash
pnpm run test --filter=frontend
```

Tests go in `frontend/src/__tests__/` with `.test.tsx` or `.spec.tsx` extensions.

## 📚 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pnpm Documentation](https://pnpm.io/)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Follow the code style guidelines
2. Write tests for new features
3. Ensure all checks pass before submitting PR
4. Update documentation as needed

## 🎯 Next Steps

- [ ] Implement authentication (JWT/sessions)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up CI/CD pipeline (GitHub Actions, GitLab CI, etc.)
- [ ] Add more complex database migrations
- [ ] Implement error handling and validation
- [ ] Add logging (winston, pino, etc.)
- [ ] Deploy to production (Vercel, Heroku, etc.)
