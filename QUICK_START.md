# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database Connection
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your PostgreSQL connection
# DATABASE_URL="postgresql://user:password@localhost:5432/stocks_db"
```

### 3. Initialize Database
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4. Start Server
```bash
npm run dev
```

Server starts on `http://localhost:3000`

### 5. Test API

#### Health Check
```bash
curl http://localhost:3000/health
```

#### Get Low PE Stocks
```bash
curl "http://localhost:3000/api/stocks/low-pe?limit=5"
```

#### Get Largest Declines
```bash
curl "http://localhost:3000/api/stocks/largest-declines?limit=5"
```

#### View Documentation
```
Open in browser: http://localhost:3000/api-docs
```

## Available Scripts

```bash
npm run dev              # Start with hot reload
npm run build            # Compile TypeScript
npm start                # Run compiled app
npm test                 # Run tests
npm run lint             # Check code style
npm run format           # Format code
npm run db:migrate       # Run migrations
npm run db:seed          # Load sample data
```

## API Endpoints

### GET /api/stocks/low-pe
**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page, max 100 (default: 25)
- `sortBy` - peRatio, symbol, or name (default: peRatio)
- `sortOrder` - asc or desc (default: asc)
- `sector` - Filter by sector
- `industry` - Filter by industry

**Example:**
```bash
curl "http://localhost:3000/api/stocks/low-pe?page=1&limit=10&sortBy=symbol&sortOrder=asc"
```

### GET /api/stocks/largest-declines
Same query parameters as above, but returns stocks with largest price declines.

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # HTTP handlers
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── db/              # Database client
│   ├── utils/           # Utilities
│   ├── docs/            # API docs
│   ├── __tests__/       # Tests
│   ├── app.ts           # Express setup
│   └── index.ts         # Server entry
├── prisma/
│   ├── schema.prisma    # Data models
│   └── migrations/      # DB migrations
├── dist/                # Compiled output
├── logs/                # Log files
├── .env                 # Configuration
├── package.json         # Dependencies
└── README.md            # Full docs
```

## Key Technologies

- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Language**: TypeScript 5
- **Database**: PostgreSQL + Prisma 5
- **Testing**: Jest + Supertest
- **Logging**: Winston
- **Documentation**: OpenAPI/Swagger

## Configuration

### Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string

**Optional:**
- `NODE_ENV` - "development", "test", "production"
- `PORT` - Server port (default: 3000)
- `LOG_LEVEL` - "debug", "info", "warn", "error"

### Database Connection Format

```
postgresql://username:password@localhost:5432/database_name
```

Example:
```
postgresql://postgres:mypassword@localhost:5432/stocks_db
```

## Troubleshooting

### Database Connection Failed
1. Check PostgreSQL is running: `pg_isready -h localhost`
2. Verify DATABASE_URL in .env
3. Create database: `createdb stocks_db`

### Port 3000 Already in Use
```bash
PORT=3001 npm run dev
```

### Build Errors
```bash
npm install
npm run build
```

### Tests Failing
```bash
# Make sure database is running
npm test
```

## Next Steps

1. **Review Full Documentation**
   - `/README.md` - Project overview
   - `/backend/README.md` - Backend details
   - `/IMPLEMENTATION.md` - Complete implementation details
   - `/DEPLOYMENT.md` - Production deployment guide

2. **Explore API**
   - Visit `http://localhost:3000/api-docs` for interactive documentation
   - Try the `/api/stocks/low-pe` endpoint
   - Try the `/api/stocks/largest-declines` endpoint

3. **Review Code**
   - Check `backend/src/` for implementation
   - Look at `backend/src/__tests__/` for test examples
   - See `prisma/schema.prisma` for data models

4. **Customize**
   - Add more endpoints in `backend/src/routes/`
   - Extend models in `prisma/schema.prisma`
   - Add business logic in `backend/src/services/`

5. **Deploy**
   - Follow `/DEPLOYMENT.md` for production setup
   - Configure environment variables
   - Set up monitoring and logging

## Support Resources

- **Express**: https://expressjs.com/
- **TypeScript**: https://www.typescriptlang.org/
- **Prisma**: https://www.prisma.io/
- **Jest**: https://jestjs.io/
- **PostgreSQL**: https://www.postgresql.org/

## Common Commands Reference

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run all tests
npm test

# Watch tests
npm run test:watch

# Test coverage
npm run test:coverage

# Linting
npm run lint

# Format code
npm run format

# Database operations
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Apply migrations
npm run db:reset         # Reset database
npm run db:seed          # Seed sample data
```

## What's Included

✅ **Backend Framework**
- Express.js with TypeScript
- Full error handling & validation
- Request logging middleware
- Health check endpoint

✅ **Database**
- PostgreSQL schema via Prisma
- Initial migrations included
- Sample data seeding
- Proper relationships & indexes

✅ **API Features**
- 2 main endpoints with filtering/sorting/pagination
- Query parameter validation
- Standardized JSON responses
- Error codes and messages

✅ **Documentation**
- OpenAPI/Swagger UI
- Comprehensive READMEs
- Deployment guide
- Code examples

✅ **Testing**
- Jest test framework
- Supertest HTTP testing
- Test database helpers
- Unit test examples

✅ **Development Tools**
- Hot reload development server
- TypeScript compilation
- ESLint & Prettier configs
- Source maps for debugging

## Ready to Deploy?

Once you've tested locally and everything works:

1. Build the application: `npm run build`
2. Follow `/DEPLOYMENT.md` for production setup
3. Configure environment variables
4. Set up PostgreSQL database
5. Run migrations: `npm run db:migrate`
6. Start server: `npm start`

Enjoy! 🚀
