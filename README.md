# Stocks API & Dashboard

A full-stack Node.js/Express backend API and React frontend dashboard for analyzing stocks with focus on low PE ratios and largest price declines.

## 🎯 Project Overview

- **Backend**: Express.js REST API with TypeScript and PostgreSQL
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Full-stack**: Integrated frontend and backend for complete stock analysis dashboard

## Features

### Backend
- 🚀 Node.js/Express server with TypeScript
- 📊 PostgreSQL database via Prisma ORM
- 📖 OpenAPI/Swagger documentation
- ✅ Jest & Supertest test coverage
- 🔍 REST endpoints for stock analysis
- 🔒 Error handling and validation middleware
- 📝 Winston logging

### Frontend
- 💎 React 18 with TypeScript
- 🎨 Tailwind CSS for responsive design
- 📱 Mobile-first responsive layout
- 🔄 Real-time data with auto-refresh polling
- 🔍 Advanced search and filtering
- ♿ Full accessibility (ARIA labels, semantic HTML)
- 📊 Interactive tables with sorting
- 📄 Pagination with configurable page sizes
- ✅ 27 unit tests with Vitest

## Project Structure

```
.
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── __tests__/         # Test files
│   │   ├── controllers/       # Request handlers
│   │   ├── db/                # Database client and seed
│   │   ├── docs/              # API documentation
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utilities
│   │   ├── app.ts             # Express app setup
│   │   └── index.ts           # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Data models
│   │   └── migrations/        # Database migrations
│   └── package.json
│
└── frontend/                   # React Dashboard
    ├── src/
    │   ├── __tests__/         # Unit tests
    │   ├── api/               # API client layer
    │   ├── components/        # Reusable components
    │   ├── hooks/             # Custom React hooks
    │   ├── pages/             # Page components
    │   ├── App.tsx            # Main app component
    │   └── main.tsx           # Entry point
    ├── index.html
    ├── vite.config.ts         # Vite configuration
    ├── tailwind.config.js     # Tailwind CSS
    ├── vitest.config.ts       # Test configuration
    └── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create a .env file based on .env.example
cp .env.example .env

# Update DATABASE_URL in .env with your PostgreSQL connection
# DATABASE_URL="postgresql://user:password@localhost:5432/stocks_db"

# Setup database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

The backend will start on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### Run Both Together

From the project root:

```bash
# Install all dependencies
npm run install-all

# Start both backend and frontend (requires concurrently)
npm run dev:all

# Or in separate terminals:
npm run dev                # Backend on :3000
npm run dev:frontend       # Frontend on :5173
```

### Build

```bash
# Build backend
cd backend && npm run build && npm start

# Build frontend
cd frontend && npm run build && npm run preview
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

## Frontend Documentation

For detailed frontend features and setup, see:

- `FRONTEND_SETUP.md` - Complete frontend setup guide
- `FRONTEND_FEATURES.md` - Comprehensive feature documentation
- `frontend/README.md` - Frontend-specific information

### Frontend Key Features

- **Two Views**: Lowest P/E Ratios and Largest 2-Year Declines
- **Interactive Tables**: Sortable, filterable, with pagination
- **Real-time Updates**: Auto-refresh every 60 seconds with manual refresh
- **Search & Filter**: By symbol, name, sector, or industry
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Full Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Comprehensive Tests**: 27 unit tests covering all components

### Frontend Stack

- React 18 with TypeScript
- Vite for fast development and optimized builds
- Tailwind CSS for responsive styling
- Vitest + React Testing Library for unit tests
- Axios for API communication

## Testing

```bash
# Backend tests
cd backend
npm test
npm run test:watch
npm run test:coverage

# Frontend tests
cd frontend
npm test
npm run test:watch
npm run test:coverage

# All tests
npm run test:all
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
