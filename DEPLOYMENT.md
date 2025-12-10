# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 12+ database running
- npm or yarn package manager
- Git for version control

## Step-by-Step Deployment

### 1. Clone or Setup Repository

```bash
# Clone the repository
git clone <repository-url>
cd stocks-api
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database

```bash
# Using psql
createdb stocks_db

# Or using PostgreSQL GUI/Admin tool
# Create database named: stocks_db
```

#### Configure Database Connection

Update `.env` file with your database credentials:

```bash
# .env
DATABASE_URL="postgresql://username:password@localhost:5432/stocks_db"
NODE_ENV="production"
PORT=3000
LOG_LEVEL="warn"
```

#### Run Migrations

```bash
# Generate Prisma client
npm run db:generate

# Run all migrations
npm run db:migrate

# Or directly apply using Prisma
npx prisma migrate deploy
```

#### Seed Initial Data

```bash
npm run db:seed
```

### 4. Build Application

```bash
npm run build
```

This creates a `dist/` directory with compiled JavaScript.

### 5. Verify Build

Check that the dist directory contains all compiled files:

```bash
ls -la dist/
```

Should see:
- `app.js` and `app.d.ts`
- `index.js` and `index.d.ts`
- `controllers/`, `services/`, `middleware/`, etc. directories
- All `.js` and `.d.ts` files

### 6. Test Application

```bash
# Run test suite
npm test

# With coverage
npm run test:coverage
```

All tests should pass.

### 7. Start Server

#### Development
```bash
npm run dev
```

Server will start with hot reload on port 3000.

#### Production
```bash
# Using npm
npm start

# Or directly with Node
node dist/index.js

# With environment variables
NODE_ENV=production PORT=3000 node dist/index.js
```

### 8. Verify Server is Running

```bash
# Check health endpoint
curl http://localhost:3000/health

# Expected response:
# {"status":"ok"}
```

### 9. Access API Documentation

Open in browser:
```
http://localhost:3000/api-docs
```

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string

### Optional
- `NODE_ENV` - "development", "test", or "production" (default: development)
- `PORT` - Server port (default: 3000)
- `LOG_LEVEL` - "debug", "info", "warn", "error" (default: info)

### Example .env File

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/stocks_db"

# Server
NODE_ENV="production"
PORT=3000

# Logging
LOG_LEVEL="warn"
```

## Docker Deployment (Optional)

Create a `Dockerfile` in backend directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
# Build image
docker build -t stocks-api:1.0.0 .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  stocks-api:1.0.0
```

## Logging

Server logs are written to:
- `logs/error.log` - Errors only
- `logs/combined.log` - All logs

Create logs directory if it doesn't exist:

```bash
mkdir -p backend/logs
```

Logs are rotated automatically (5MB max per file, 5 files kept).

## Monitoring

### Health Check Endpoint

```bash
curl http://localhost:3000/health
```

Response: `{"status":"ok"}`

### View Error Logs

```bash
tail -f backend/logs/error.log
```

### Test API Endpoints

```bash
# Low PE stocks
curl "http://localhost:3000/api/stocks/low-pe?limit=5"

# Largest declines
curl "http://localhost:3000/api/stocks/largest-declines?limit=5"
```

## Troubleshooting

### Database Connection Error

```
Error: P1001: Can't reach database server
```

**Solutions:**
1. Verify PostgreSQL is running: `pg_isready -h localhost -p 5432`
2. Check DATABASE_URL is correct
3. Verify database exists: `psql -l | grep stocks_db`
4. Check user permissions

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
1. Change PORT environment variable: `PORT=3001 npm start`
2. Kill existing process: `lsof -i :3000` then `kill -9 <PID>`

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Migration Issues

```bash
# Reset database (careful!)
npm run db:reset

# Reapply migrations
npm run db:migrate
```

## Performance Tips

1. **Database Indexing**
   - Indexes are pre-created on commonly queried fields
   - Monitor slow queries in logs

2. **Caching** (Future)
   - Consider Redis for frequently accessed data
   - Cache latest stock data with TTL

3. **Pagination**
   - Default limit of 25 to avoid large result sets
   - Maximum limit of 100 per request

4. **Connection Pooling**
   - Prisma handles connection pooling automatically
   - Adjust in .env if needed: `DATABASE_URL="...?schema=public"`

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` file
   - Keep DATABASE_URL private
   - Use `.env.example` as template

2. **Input Validation**
   - All query parameters are validated
   - Invalid inputs return 400 Bad Request

3. **Error Messages**
   - Production logs don't expose sensitive details
   - Error responses are standardized

4. **CORS** (Future)
   - Add CORS middleware if serving frontend
   - Configure allowed origins

## Backup Strategy

### Database Backup

```bash
# Backup database
pg_dump stocks_db > backup-$(date +%Y%m%d).sql

# Restore from backup
psql stocks_db < backup-20240101.sql
```

### Application Files Backup

```bash
# Backup application
tar -czf stocks-api-$(date +%Y%m%d).tar.gz backend/
```

## Scaling Considerations

1. **Horizontal Scaling**
   - Run multiple instances behind load balancer
   - Each instance connects to same database

2. **Database Scaling**
   - Monitor slow queries
   - Consider read replicas for high query volume
   - Partition data if it grows very large

3. **Caching Layer**
   - Add Redis for frequently accessed data
   - Cache latest prices and PE ratios

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous version
git checkout <previous-commit>

# Rebuild and restart
npm run build
npm start
```

## Post-Deployment Checklist

- [ ] Database migrations completed successfully
- [ ] All tests pass: `npm test`
- [ ] Health endpoint responds: `curl http://localhost:3000/health`
- [ ] API endpoints work: `curl http://localhost:3000/api/stocks/low-pe`
- [ ] Swagger docs load: `http://localhost:3000/api-docs`
- [ ] Error logs are empty or contain expected messages
- [ ] Database backup created
- [ ] Environment variables are secure
- [ ] Monitoring/alerting configured
- [ ] Load balancer/reverse proxy configured (if applicable)

## Support

For issues or questions:
1. Check logs: `tail -f backend/logs/error.log`
2. Review README.md and backend/README.md
3. Check implementation in source code
4. Review TypeScript types for API contracts

## Version Information

- Node.js: 18+
- Express: 4.18.2
- TypeScript: 5.3.3
- Prisma: 5.7.0
- PostgreSQL: 12+
