# Stocks API

A Node.js/Express backend API for analyzing stocks with focus on low PE ratios and largest price declines.

## Features

- 🚀 Node.js/Express server with TypeScript
- 📊 PostgreSQL database via Prisma ORM
- 📖 OpenAPI/Swagger documentation
- ✅ Jest & Supertest test coverage
- 🔍 REST endpoints for stock analysis
- 🔒 Error handling and validation middleware
- 📝 Winston logging

## Project Structure

```
backend/
├── src/
│   ├── __tests__/          # Test files
│   ├── controllers/        # Request handlers
│   ├── db/                 # Database client and seed
│   ├── docs/               # API documentation
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utilities
│   ├── app.ts              # Express app setup
│   └── index.ts            # Server entry point
├── prisma/
│   ├── schema.prisma       # Data models
│   └── migrations/         # Database migrations
├── .env.example            # Environment template
├── jest.config.js          # Jest configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update `DATABASE_URL` with your PostgreSQL connection string:

```
DATABASE_URL="postgresql://user:password@localhost:5432/stocks_db"
NODE_ENV="development"
PORT=3000
LOG_LEVEL="info"
```

### Database Setup

```bash
# Create database and run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

### Development

```bash
# Start development server with hot reload
npm run dev
```

The server will start on `http://localhost:3000`

### Build

```bash
# Compile TypeScript
npm run build

# Run compiled JavaScript
npm start
```

## API Endpoints

### Stocks with Lowest PE Ratios

```
GET /api/stocks/low-pe?page=1&limit=25&sortBy=peRatio&sortOrder=asc&sector=Technology
```

Returns top 25 stocks with lowest PE ratios.

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Results per page, max 100 (default: 25)
- `sortBy` (string): Sort field - peRatio, symbol, name (default: peRatio)
- `sortOrder` (string): asc or desc (default: asc)
- `sector` (string): Filter by sector (optional)
- `industry` (string): Filter by industry (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "symbol": "AAPL",
      "name": "Apple Inc",
      "sector": "Technology",
      "industry": "Consumer Electronics",
      "peRatio": 25.5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 100,
    "totalPages": 4
  }
}
```

### Stocks with Largest Price Declines

```
GET /api/stocks/largest-declines?page=1&limit=25&sortBy=priceChange&sortOrder=asc
```

Returns top 25 stocks with largest price declines.

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Results per page, max 100 (default: 25)
- `sortBy` (string): Sort field - priceChange, symbol, name (default: priceChange)
- `sortOrder` (string): asc or desc (default: asc)
- `sector` (string): Filter by sector (optional)
- `industry` (string): Filter by industry (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "symbol": "XYZ",
      "name": "XYZ Corporation",
      "sector": "Technology",
      "industry": "Software",
      "priceChange": -12.5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 150,
    "totalPages": 6
  }
}
```

### Health Check

```
GET /health
```

Returns server status.

## API Documentation

Swagger/OpenAPI documentation is available at:

```
http://localhost:3000/api-docs
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Logging

Logs are written to:
- `logs/error.log` - Error level logs
- `logs/combined.log` - All logs

Console logging is enabled in development mode.

Configure log level via `LOG_LEVEL` environment variable (debug, info, warn, error).

## Data Models

### Stock
- `id`: Unique identifier
- `symbol`: Stock ticker symbol
- `name`: Company name
- `sector`: Business sector
- `industry`: Industry classification
- `marketCap`: Market capitalization

### PERatio
- `id`: Unique identifier
- `stockId`: Reference to Stock
- `ratio`: PE ratio value
- `date`: Ratio date

### HistoricalPrice
- `id`: Unique identifier
- `stockId`: Reference to Stock
- `open`: Opening price
- `high`: Highest price
- `low`: Lowest price
- `close`: Closing price
- `volume`: Trading volume
- `date`: Price date

## Error Handling

The API returns standardized error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters"
  }
}
```

Common error codes:
- `VALIDATION_ERROR` (400): Invalid input
- `NOT_FOUND` (404): Resource not found
- `INTERNAL_ERROR` (500): Server error

## Future Enhancements

- [ ] Authentication and authorization
- [ ] Rate limiting
- [ ] Caching layer (Redis)
- [ ] Real-time data updates via WebSocket
- [ ] Advanced filtering and analytics
- [ ] Historical analysis endpoints
- [ ] Export data to CSV/Excel

## License

Proprietary - All rights reserved
