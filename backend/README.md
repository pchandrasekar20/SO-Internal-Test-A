# Stocks API Backend

Node.js/Express backend with TypeScript, Prisma, and PostgreSQL for stock analysis.

## Quick Start

### Install Dependencies

```bash
npm install
```

### Setup Environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection:

```
DATABASE_URL="postgresql://user:password@localhost:5432/stocks_db"
```

### Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Create database and run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

### Start Development Server

```bash
npm run dev
```

Server runs on http://localhost:3000

## Available Scripts

```bash
# Development with hot reload
npm run dev

# TypeScript compilation
npm run build

# Run compiled server
npm start

# Run tests
npm test

# Watch mode tests
npm run test:watch

# Test coverage
npm run test:coverage

# Lint
npm lint

# Format code
npm run format

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:reset       # Reset database
npm run db:seed        # Seed data
```

## Project Layout

```
src/
├── __tests__/              # Jest tests
│   ├── controllers/        # Controller tests
│   └── utils/              # Test utilities
├── controllers/            # Request handlers
├── db/                     # Database setup
│   ├── client.ts          # Prisma client
│   └── seed.ts            # Seed script
├── docs/                   # API documentation
│   └── swagger.ts         # OpenAPI spec
├── middleware/             # Express middleware
│   ├── errorHandler.ts    # Error handling
│   └── requestLogger.ts   # Request logging
├── routes/                 # API routes
│   └── stocks.ts          # Stock endpoints
├── services/               # Business logic
│   └── stocksService.ts   # Stock operations
├── utils/                  # Utilities
│   ├── errors.ts          # Error classes
│   ├── logger.ts          # Winston logger
│   ├── pagination.ts      # Pagination helpers
│   └── validation.ts      # Input validation
├── app.ts                  # Express app
└── index.ts               # Server entry
```

## API Routes

### GET /api/stocks/low-pe
Returns stocks with lowest PE ratios with pagination, sorting, and filtering.

Query params:
- `page`: Page number (default: 1)
- `limit`: Items per page, max 100 (default: 25)
- `sortBy`: peRatio, symbol, or name (default: peRatio)
- `sortOrder`: asc or desc (default: asc)
- `sector`: Filter by sector
- `industry`: Filter by industry

### GET /api/stocks/largest-declines
Returns stocks with largest price declines.

Query params:
- `page`: Page number (default: 1)
- `limit`: Items per page, max 100 (default: 25)
- `sortBy`: priceChange, symbol, or name (default: priceChange)
- `sortOrder`: asc or desc (default: asc)
- `sector`: Filter by sector
- `industry`: Filter by industry

### GET /health
Health check endpoint.

### GET /api-docs
Swagger UI documentation.

## Database Schema

### Stock
```
- id (string, primary)
- symbol (string, unique)
- name (string)
- sector (string, nullable)
- industry (string, nullable)
- marketCap (integer, nullable)
- createdAt (timestamp)
- updatedAt (timestamp)
```

### PERatio
```
- id (string, primary)
- stockId (string, foreign)
- ratio (float)
- date (timestamp)
- createdAt (timestamp)
- updatedAt (timestamp)
```

### HistoricalPrice
```
- id (string, primary)
- stockId (string, foreign)
- open (float)
- high (float)
- low (float)
- close (float)
- volume (integer)
- date (timestamp)
- createdAt (timestamp)
- updatedAt (timestamp)
```

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

Test files are located in `src/__tests__/` with `.test.ts` extension.

Tests use supertest for HTTP testing and interact with a test database.

## Error Handling

All errors are caught and returned in standardized format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

Status codes:
- 200: Success
- 400: Bad request / Validation error
- 404: Not found
- 500: Internal server error

## Logging

Logs are written to `logs/` directory:
- `error.log`: Error level logs
- `combined.log`: All logs

Set `LOG_LEVEL` env var to control log level (debug, info, warn, error).

In development, logs also print to console.

## Development Tips

### Hot Reload
Development server uses `ts-node-dev` for automatic reload on file changes.

### TypeScript
- Full strict mode enabled
- Path aliases configured (`@/*` -> `src/*`)
- Source maps generated

### Prisma
- Visual Studio Code extension: `Prisma.prisma`
- Studio: `npx prisma studio`
- Generate schema from database: `npx prisma db pull`

### Testing
- Jest configured with ts-jest
- Supertest for HTTP testing
- Test utilities in `__tests__/utils/`

## Deployment

### Build
```bash
npm run build
```

Outputs to `dist/` directory.

### Environment
Set production environment variables:
```
NODE_ENV=production
DATABASE_URL=<production-database-url>
PORT=<port>
LOG_LEVEL=warn
```

### Run
```bash
npm start
```

Or with Node directly:
```bash
node dist/index.js
```
