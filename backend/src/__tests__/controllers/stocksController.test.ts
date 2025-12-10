import app from '@/app';
import prisma from '@/db/client';
import {
  createTestClient,
  cleanDatabase,
  createTestStock,
  createTestPERatio,
  createTestHistoricalPrice,
} from '@/__tests__/utils/testHelpers';

describe('Stocks Controller', () => {
  const client = createTestClient(app);

  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('GET /api/stocks/low-pe', () => {
    it('should return empty array when no stocks exist', async () => {
      const response = await client.get('/api/stocks/low-pe');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should return stocks sorted by PE ratio', async () => {
      const stock1 = await createTestStock('AAPL', 'Apple Inc');
      const stock2 = await createTestStock('MSFT', 'Microsoft Corp');

      await createTestPERatio(stock1.id, 25.5);
      await createTestPERatio(stock2.id, 15.3);

      const response = await client.get('/api/stocks/low-pe');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].symbol).toBe('MSFT');
      expect(response.body.data[0].peRatio).toBe(15.3);
      expect(response.body.data[1].symbol).toBe('AAPL');
      expect(response.body.data[1].peRatio).toBe(25.5);
    });

    it('should paginate results correctly', async () => {
      for (let i = 0; i < 30; i++) {
        const stock = await createTestStock(`STOCK${i}`, `Stock ${i}`);
        await createTestPERatio(stock.id, 20 + i);
      }

      const response = await client
        .get('/api/stocks/low-pe')
        .query({ page: 2, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.limit).toBe(10);
      expect(response.body.pagination.total).toBe(30);
      expect(response.body.pagination.totalPages).toBe(3);
    });

    it('should filter by sector', async () => {
      const stock1 = await createTestStock('AAPL', 'Apple Inc', 'Technology');
      const stock2 = await createTestStock('MSFT', 'Microsoft Corp', 'Technology');
      const stock3 = await createTestStock('JPM', 'JPMorgan Chase', 'Finance');

      await createTestPERatio(stock1.id, 25.5);
      await createTestPERatio(stock2.id, 15.3);
      await createTestPERatio(stock3.id, 12.1);

      const response = await client
        .get('/api/stocks/low-pe')
        .query({ sector: 'Technology' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should handle invalid page parameter', async () => {
      const response = await client
        .get('/api/stocks/low-pe')
        .query({ page: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle invalid sortBy parameter', async () => {
      const response = await client
        .get('/api/stocks/low-pe')
        .query({ sortBy: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should sort by symbol in ascending order', async () => {
      const stock1 = await createTestStock('ZZZZ', 'Z Stock');
      const stock2 = await createTestStock('AAAA', 'A Stock');

      await createTestPERatio(stock1.id, 20);
      await createTestPERatio(stock2.id, 20);

      const response = await client
        .get('/api/stocks/low-pe')
        .query({ sortBy: 'symbol', sortOrder: 'asc' });

      expect(response.status).toBe(200);
      expect(response.body.data[0].symbol).toBe('AAAA');
      expect(response.body.data[1].symbol).toBe('ZZZZ');
    });
  });

  describe('GET /api/stocks/largest-declines', () => {
    it('should return empty array when no stocks exist', async () => {
      const response = await client.get('/api/stocks/largest-declines');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should return stocks with largest price declines', async () => {
      const stock1 = await createTestStock('AAPL', 'Apple Inc');
      const stock2 = await createTestStock('MSFT', 'Microsoft Corp');

      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      await createTestHistoricalPrice(stock1.id, 150, 150, 150, 150, 1000000, today);
      await createTestHistoricalPrice(stock1.id, 155, 155, 155, 155, 1000000, yesterday);

      await createTestHistoricalPrice(stock2.id, 300, 300, 300, 300, 1000000, today);
      await createTestHistoricalPrice(stock2.id, 310, 310, 310, 310, 1000000, yesterday);

      const response = await client.get('/api/stocks/largest-declines');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].priceChange).toBeLessThan(response.body.data[1].priceChange);
    });

    it('should paginate results correctly', async () => {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      for (let i = 0; i < 30; i++) {
        const stock = await createTestStock(`STOCK${i}`, `Stock ${i}`);
        await createTestHistoricalPrice(stock.id, 100 - i, 100 - i, 100 - i, 100 - i, 1000000, today);
        await createTestHistoricalPrice(stock.id, 110 - i, 110 - i, 110 - i, 110 - i, 1000000, yesterday);
      }

      const response = await client
        .get('/api/stocks/largest-declines')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.total).toBe(30);
    });

    it('should filter by industry', async () => {
      const stock1 = await createTestStock('AAPL', 'Apple Inc', 'Technology', 'Consumer Electronics');
      const stock2 = await createTestStock('JPM', 'JPMorgan Chase', 'Finance', 'Banking');

      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      await createTestHistoricalPrice(stock1.id, 150, 150, 150, 150, 1000000, today);
      await createTestHistoricalPrice(stock1.id, 155, 155, 155, 155, 1000000, yesterday);

      await createTestHistoricalPrice(stock2.id, 100, 100, 100, 100, 1000000, today);
      await createTestHistoricalPrice(stock2.id, 110, 110, 110, 110, 1000000, yesterday);

      const response = await client
        .get('/api/stocks/largest-declines')
        .query({ industry: 'Banking' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].symbol).toBe('JPM');
    });

    it('should handle invalid sortOrder parameter', async () => {
      const response = await client
        .get('/api/stocks/largest-declines')
        .query({ sortOrder: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should sort by price change in descending order', async () => {
      const stock1 = await createTestStock('STOCK1', 'Stock 1');
      const stock2 = await createTestStock('STOCK2', 'Stock 2');

      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      await createTestHistoricalPrice(stock1.id, 95, 95, 95, 95, 1000000, today);
      await createTestHistoricalPrice(stock1.id, 100, 100, 100, 100, 1000000, yesterday);

      await createTestHistoricalPrice(stock2.id, 80, 80, 80, 80, 1000000, today);
      await createTestHistoricalPrice(stock2.id, 100, 100, 100, 100, 1000000, yesterday);

      const response = await client
        .get('/api/stocks/largest-declines')
        .query({ sortBy: 'priceChange', sortOrder: 'desc' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].priceChange).toBeLessThan(response.body.data[1].priceChange);
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await client.get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await client.get('/api/unknown');

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});
