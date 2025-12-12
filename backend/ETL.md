# ETL Pipeline Documentation

This document describes the data pipeline for fetching stock fundamentals and historical prices from Finnhub.

## Overview

The ETL (Extract, Transform, Load) pipeline automatically fetches stock market data from Finnhub API and stores it in PostgreSQL. The pipeline includes:

1. **Symbol Fetching**: Retrieve list of all US stock symbols
2. **Fundamentals Fetching**: Retrieve PE ratios and market cap data
3. **Historical Prices**: Retrieve historical daily OHLCV data

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs axios for API calls and p-queue for rate limiting.

### 2. Configure Environment Variables

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and set your API keys:

```
FINNHUB_API_KEY=your_finnhub_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
ETL_BATCH_SIZE=10
ETL_RATE_LIMIT_MS=100
```

### Getting API Keys

- **Finnhub API**: Sign up at https://finnhub.io/register
- **Alpha Vantage API**: Sign up at https://www.alphavantage.co/api/ (fallback provider)

### 3. Setup Database

```bash
npm run db:generate
npm run db:migrate
```

## Running the ETL Pipeline

### Option 1: Run Individual ETL Jobs

```bash
# Fetch all US stock symbols
npm run etl:symbols

# Fetch fundamentals (PE ratios, market cap) for all stocks
npm run etl:fundamentals

# Fetch historical prices for last 730 days (2 years)
npm run etl:prices
# Or specify custom number of days
npm run etl:prices 365
```

### Option 2: Run Full ETL Pipeline

Run all three jobs sequentially:

```bash
npm run etl:run
# Or with custom days for historical prices
npm run etl:run 730
```

This will:
1. Fetch all US stock symbols
2. Fetch fundamentals (PE ratios, market cap)
3. Fetch historical prices for the specified period

## Rate Limiting & API Handling

The pipeline includes built-in rate limiting to respect API limits:

- **Rate Limit**: 100ms delay between API calls (configurable via `ETL_RATE_LIMIT_MS`)
- **Batch Size**: 10 stocks per batch to manage memory (configurable via `ETL_BATCH_SIZE`)
- **Concurrency**: Single-threaded to avoid overwhelming the API
- **Retries**: Failed API calls are logged but don't stop the pipeline
- **Fallback**: Alpha Vantage API can be used as fallback (not yet implemented in primary flow)

## Data Flow

### Symbol Fetching (`etl:symbols`)

```
Finnhub API
    ↓
Get all US exchange symbols
    ↓
Filter for Common Stock type
    ↓
Store in Stock table
```

**Time**: ~2-5 minutes for 8,000+ symbols

### Fundamentals Fetching (`etl:fundamentals`)

```
Database (all stocks)
    ↓
Finnhub API - Get fundamentals
    ↓
Extract PE ratio from metric.10P
    ↓
Extract market cap
    ↓
Store PE ratio in PERatio table
    ↓
Update stock market cap
```

**Time**: ~30-60 minutes for 8,000+ stocks (rate limited)

### Historical Prices (`etl:prices`)

```
Database (all stocks)
    ↓
Finnhub API - Get daily candles
    ↓
Extract OHLCV data for each day
    ↓
Normalize dates to midnight UTC
    ↓
Upsert in HistoricalPrice table
```

**Time**: ~60-120 minutes for 8,000+ stocks × 730 days (rate limited)

## Database Schema

### Stock Table
```sql
CREATE TABLE stocks (
  id TEXT PRIMARY KEY,
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sector TEXT,
  industry TEXT,
  marketCap INTEGER, -- in millions
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);
```

### PERatio Table
```sql
CREATE TABLE pe_ratios (
  id TEXT PRIMARY KEY,
  stockId TEXT FOREIGN KEY,
  ratio FLOAT NOT NULL,
  date DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  UNIQUE(stockId, date)
);
```

### HistoricalPrice Table
```sql
CREATE TABLE historical_prices (
  id TEXT PRIMARY KEY,
  stockId TEXT FOREIGN KEY,
  open FLOAT NOT NULL,
  high FLOAT NOT NULL,
  low FLOAT NOT NULL,
  close FLOAT NOT NULL,
  volume INTEGER NOT NULL,
  date DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  UNIQUE(stockId, date)
);
```

## Calculations

### PE Ratio

PE ratio is extracted directly from Finnhub's fundamental metrics:

```
PE Ratio = Stock Price / Earnings Per Share
```

Formula: `peRatio = metric['10P'] || metric['P/E']`

- Values <= 0 are skipped
- Stored with date for historical tracking
- Deduplicated by (stockId, date)

### Price Change (2-Year Decline)

Calculated from historical prices:

```
Percentage Change = ((Price_Today - Price_2YearsAgo) / Price_2YearsAgo) × 100
```

- Takes latest and previous closing prices
- Negative values indicate losses
- Calculated in the API layer, not stored in DB

### Market Cap Normalization

Finnhub returns market cap in cents, normalized to millions:

```
Market Cap (millions) = marketCapitalization / 1,000,000
```

## Data Validation

The pipeline validates:

1. **Symbols**: Must be Common Stock type with displaySymbol
2. **PE Ratios**: Must be positive numbers (> 0)
3. **Prices**: Must have all OHLCV values, volume must be >= 0
4. **Dates**: Normalized to midnight UTC for consistency
5. **Duplicates**: Skipped via database UNIQUE constraints

## Error Handling

Errors are logged but don't stop the pipeline:

- **Symbol fetch fails**: Logs warning, continues with next symbol
- **Fundamentals fail**: Logs warning, continues with next stock
- **Price fetch fails**: Logs warning, continues with next stock
- **Database write fails**: Logs error, continues with next item

All errors are counted in the ETL stats report.

## Scheduling the ETL Job

### Option 1: Cron Job (Linux/Mac)

Edit crontab:
```bash
crontab -e
```

Add scheduled job:
```bash
# Run ETL pipeline daily at 2 AM
0 2 * * * cd /path/to/backend && npm run etl:run >> logs/etl-cron.log 2>&1

# Run fundamentals update daily at 3 AM (after symbols)
0 3 * * * cd /path/to/backend && npm run etl:fundamentals >> logs/etl-cron.log 2>&1

# Run prices update every 6 hours
0 */6 * * * cd /path/to/backend && npm run etl:prices 30 >> logs/etl-cron.log 2>&1
```

### Option 2: Docker Container with Cron

Create a `Dockerfile.etl`:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY backend /app

RUN npm install && npm run build

# Install cron
RUN apk add --no-cache dcron

# Copy crontab
COPY etl-crontab /etc/crontabs/root

# Start cron daemon
CMD ["crond", "-f", "-l", "2"]
```

### Option 3: Node.js Scheduler (node-cron)

Add to package.json:
```json
{
  "dependencies": {
    "node-cron": "^3.0.2"
  },
  "scripts": {
    "etl:scheduler": "ts-node src/services/etlScheduler.ts"
  }
}
```

Create `src/services/etlScheduler.ts`:

```typescript
import cron from 'node-cron';
import logger from '@/utils/logger';
import ETLService from './etlService';

const etl = new ETLService();

// Run full ETL daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  logger.info('Starting scheduled ETL job');
  try {
    await etl.fetchAndStoreSymbols('US');
    await etl.fetchAndStoreFundamentals();
    await etl.fetchAndStoreHistoricalPrices(730);
    logger.info('Scheduled ETL job completed');
  } catch (error) {
    logger.error(`Scheduled ETL job failed: ${error}`);
  }
});

// Run fundamentals update every 6 hours
cron.schedule('0 */6 * * *', async () => {
  logger.info('Starting scheduled fundamentals update');
  try {
    await etl.fetchAndStoreFundamentals();
    logger.info('Scheduled fundamentals update completed');
  } catch (error) {
    logger.error(`Scheduled fundamentals update failed: ${error}`);
  }
});

logger.info('ETL scheduler started');
```

### Option 4: Kubernetes CronJob

Create `etl-cronjob.yaml`:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: stocks-etl
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: stocks-etl
            image: stocks-api:latest
            command: ["npm", "run", "etl:run"]
            env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: stocks-secrets
                  key: database-url
            - name: FINNHUB_API_KEY
              valueFrom:
                secretKeyRef:
                  name: stocks-secrets
                  key: finnhub-api-key
          restartPolicy: OnFailure
```

Deploy:
```bash
kubectl apply -f etl-cronjob.yaml
```

## Monitoring & Logging

### Log Output

Logs are written to:
- `logs/combined.log`: All logs
- `logs/error.log`: Error level logs only

### ETL Stats

Each ETL job prints summary statistics:

```
Symbol ETL job completed:
  Symbols processed: 8256
  Symbols created: 1234
  Errors: 12
  Duration: 245s
```

### Manual Monitoring

Check recent logs:
```bash
tail -f logs/combined.log | grep ETL
```

Monitor a running job:
```bash
npm run etl:run &
tail -f logs/combined.log
```

## Troubleshooting

### Issue: API Key Invalid

**Error**: `401 Unauthorized`

**Solution**: 
1. Verify API key in `.env`
2. Check API key hasn't expired
3. Verify API key has sufficient limits

### Issue: Rate Limit Exceeded

**Error**: `429 Too Many Requests`

**Solution**:
1. Increase `ETL_RATE_LIMIT_MS` in `.env`
2. Decrease `ETL_BATCH_SIZE` for more granular control
3. Run jobs during off-peak hours

### Issue: Database Connection Failed

**Error**: `ECONNREFUSED`

**Solution**:
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Verify database exists: `createdb stocks_db`
4. Verify credentials are correct

### Issue: Out of Memory

**Error**: `JavaScript heap out of memory`

**Solution**:
1. Decrease `ETL_BATCH_SIZE`
2. Increase Node memory: `NODE_OPTIONS="--max-old-space-size=2048" npm run etl:run`

### Issue: Incomplete Data

**Symptom**: Some stocks missing PE ratio or prices

**Solution**:
1. Check error logs for failed API calls
2. Re-run the specific ETL job
3. Verify Finnhub API has data for the stock (some new stocks have no historical data)

## Testing

Run unit tests for ETL service:

```bash
npm test -- etlService.test.ts
```

Run calculation tests:

```bash
npm test -- calculations.test.ts
```

Run all tests with coverage:

```bash
npm run test:coverage
```

## Performance Tuning

### Optimize for Speed

1. **Increase Rate Limit** (if API allows):
   ```
   ETL_RATE_LIMIT_MS=50
   ```

2. **Increase Batch Size**:
   ```
   ETL_BATCH_SIZE=20
   ```

3. **Run parallel jobs** on different machines with subset of stocks

### Optimize for Resource Usage

1. **Decrease Batch Size**:
   ```
   ETL_BATCH_SIZE=5
   ```

2. **Decrease Rate Limit** to reduce memory:
   ```
   ETL_RATE_LIMIT_MS=500
   ```

3. **Split into smaller date ranges**:
   ```
   npm run etl:prices 180  # 6 months at a time
   ```

## API Rate Limits

### Finnhub Free Plan
- 60 API calls/minute
- Recommended: `ETL_RATE_LIMIT_MS=1000` (1 second delay)

### Finnhub Premium Plans
- Professional: 300+ API calls/minute
- Recommended: `ETL_RATE_LIMIT_MS=200` (0.2 second delay)

## Data Freshness

Recommended update schedule:

| Data | Frequency | Command |
|------|-----------|---------|
| Symbols | Weekly | `npm run etl:symbols` |
| Fundamentals | Daily | `npm run etl:fundamentals` |
| Prices | 4x Daily | `npm run etl:prices 30` |
| Full Pipeline | Weekly | `npm run etl:run` |

## Maintenance

### Clear Old Logs

```bash
find logs/ -name "*.log" -mtime +30 -delete
```

### Database Cleanup

Remove old price data (older than 2 years):

```sql
DELETE FROM historical_prices
WHERE date < CURRENT_DATE - INTERVAL '2 years';
```

### Verify Data Integrity

```sql
-- Check stocks without PE ratio
SELECT * FROM stocks s
WHERE NOT EXISTS (SELECT 1 FROM pe_ratios WHERE stockId = s.id)
LIMIT 10;

-- Check stocks without price data
SELECT * FROM stocks s
WHERE NOT EXISTS (SELECT 1 FROM historical_prices WHERE stockId = s.id)
LIMIT 10;
```

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────┐
│          ETL Service                        │
├─────────────────────────────────────────────┤
│                                             │
│  ┌────────────────────────────────────┐   │
│  │  Finnhub Client                    │   │
│  │  - getSymbols()                    │   │
│  │  - getBasicFinancials()            │   │
│  │  - getCandles()                    │   │
│  └────────────────────────────────────┘   │
│                  ↓                         │
│  ┌────────────────────────────────────┐   │
│  │  Rate Limiter (p-queue)            │   │
│  │  - Enforce API rate limits         │   │
│  │  - Queue requests                  │   │
│  └────────────────────────────────────┘   │
│                  ↓                         │
│  ┌────────────────────────────────────┐   │
│  │  Prisma ORM                        │   │
│  │  - Store/update database           │   │
│  │  - Handle duplicates               │   │
│  └────────────────────────────────────┘   │
│                  ↓                         │
│  ┌────────────────────────────────────┐   │
│  │  PostgreSQL                        │   │
│  │  - stocks table                    │   │
│  │  - pe_ratios table                 │   │
│  │  - historical_prices table         │   │
│  └────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

## Support

For issues or questions:

1. Check logs in `logs/` directory
2. Review this documentation
3. Test API keys manually with curl
4. Check Finnhub status page: https://status.finnhub.io/
5. Verify PostgreSQL connection
