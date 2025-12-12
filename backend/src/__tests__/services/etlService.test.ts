import prisma from '@/db/client';
import ETLService from '@/services/etlService';
import FinnhubClient from '@/services/finnhubClient';
import RateLimiter from '@/utils/rateLimiter';
import logger from '@/utils/logger';

jest.mock('@/services/finnhubClient');
jest.mock('@/utils/rateLimiter');
jest.mock('@/utils/logger');

describe('ETLService', () => {
  let etlService: ETLService;

  beforeEach(() => {
    jest.clearAllMocks();
    etlService = new ETLService();
  });

  describe('fetchAndStoreSymbols', () => {
    it('should fetch symbols and create new stocks', async () => {
      const mockSymbols = [
        {
          symbol: 'AAPL',
          description: 'Apple Inc',
          displaySymbol: 'AAPL',
          type: 'Common Stock',
          mic: 'XNAS',
          currency: 'USD',
        },
        {
          symbol: 'MSFT',
          description: 'Microsoft Corporation',
          displaySymbol: 'MSFT',
          type: 'Common Stock',
          mic: 'XNAS',
          currency: 'USD',
        },
      ];

      jest
        .spyOn(FinnhubClient.prototype, 'getSymbols' as any)
        .mockResolvedValue(mockSymbols);

      const createSpy = jest
        .spyOn(prisma.stock, 'create')
        .mockResolvedValue({
          id: 'test-id',
          symbol: 'AAPL',
          name: 'Apple Inc',
          sector: null,
          industry: null,
          marketCap: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      jest
        .spyOn(prisma.stock, 'findUnique')
        .mockResolvedValue(null);

      const stats = await etlService.fetchAndStoreSymbols('US');

      expect(stats.symbolsProcessed).toBe(2);
      expect(stats.symbolsCreated).toBe(2);
      expect(createSpy).toHaveBeenCalledTimes(2);
    });

    it('should skip duplicate symbols', async () => {
      const mockSymbols = [
        {
          symbol: 'AAPL',
          description: 'Apple Inc',
          displaySymbol: 'AAPL',
          type: 'Common Stock',
        },
      ];

      jest
        .spyOn(FinnhubClient.prototype, 'getSymbols' as any)
        .mockResolvedValue(mockSymbols);

      const existingStock = {
        id: 'existing-id',
        symbol: 'AAPL',
        name: 'Apple Inc',
        sector: null,
        industry: null,
        marketCap: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prisma.stock, 'findUnique')
        .mockResolvedValue(existingStock);

      const createSpy = jest
        .spyOn(prisma.stock, 'create')
        .mockResolvedValue(existingStock);

      const stats = await etlService.fetchAndStoreSymbols('US');

      expect(stats.symbolsProcessed).toBe(1);
      expect(stats.symbolsCreated).toBe(0);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should filter out non-common stocks', async () => {
      const mockSymbols = [
        {
          symbol: 'AAPL',
          description: 'Apple Inc',
          displaySymbol: 'AAPL',
          type: 'Common Stock',
        },
        {
          symbol: 'SPY',
          description: 'SPDR S&P 500 ETF',
          displaySymbol: 'SPY',
          type: 'ETF',
        },
      ];

      jest
        .spyOn(FinnhubClient.prototype, 'getSymbols' as any)
        .mockResolvedValue(mockSymbols);

      jest
        .spyOn(prisma.stock, 'findUnique')
        .mockResolvedValue(null);

      jest
        .spyOn(prisma.stock, 'create')
        .mockResolvedValue({
          id: 'test-id',
          symbol: 'AAPL',
          name: 'Apple Inc',
          sector: null,
          industry: null,
          marketCap: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      const stats = await etlService.fetchAndStoreSymbols('US');

      expect(stats.symbolsProcessed).toBe(1);
      expect(stats.symbolsCreated).toBe(1);
    });

    it('should handle API errors gracefully', async () => {
      jest
        .spyOn(FinnhubClient.prototype, 'getSymbols' as any)
        .mockRejectedValue(new Error('API Error'));

      const stats = await etlService.fetchAndStoreSymbols('US');

      expect(stats.errors).toBe(1);
      expect(stats.symbolsProcessed).toBe(0);
    });

    it('should return empty array if no symbols returned', async () => {
      jest
        .spyOn(FinnhubClient.prototype, 'getSymbols' as any)
        .mockResolvedValue([]);

      const stats = await etlService.fetchAndStoreSymbols('US');

      expect(stats.symbolsProcessed).toBe(0);
      expect(stats.symbolsCreated).toBe(0);
    });
  });

  describe('fetchAndStoreFundamentals', () => {
    it('should fetch and store PE ratios', async () => {
      const stocks = [
        { id: 'stock-1', symbol: 'AAPL' },
      ];

      jest.spyOn(prisma.stock, 'findMany').mockResolvedValue(stocks as any);

      jest
        .spyOn(FinnhubClient.prototype, 'getBasicFinancials' as any)
        .mockResolvedValue({
          metric: {
            '10P': 25.5,
            marketCapitalization: 3000000000000,
          },
        });

      jest.spyOn(prisma.pERatio, 'findUnique').mockResolvedValue(null);

      const createSpy = jest
        .spyOn(prisma.pERatio, 'create')
        .mockResolvedValue({
          id: 'pe-1',
          stockId: 'stock-1',
          ratio: 25.5,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      jest.spyOn(prisma.stock, 'update').mockResolvedValue({
        id: 'stock-1',
        symbol: 'AAPL',
        name: 'Apple',
        sector: null,
        industry: null,
        marketCap: 3000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const stats = await etlService.fetchAndStoreFundamentals();

      expect(stats.fundamentalsProcessed).toBe(1);
      expect(createSpy).toHaveBeenCalled();
    });

    it('should skip stocks without PE ratio', async () => {
      const stocks = [
        { id: 'stock-1', symbol: 'AAPL' },
      ];

      jest.spyOn(prisma.stock, 'findMany').mockResolvedValue(stocks as any);

      jest
        .spyOn(FinnhubClient.prototype, 'getBasicFinancials' as any)
        .mockResolvedValue({
          metric: {
            marketCapitalization: 3000000000000,
          },
        });

      const createSpy = jest
        .spyOn(prisma.pERatio, 'create');

      const stats = await etlService.fetchAndStoreFundamentals();

      expect(stats.fundamentalsProcessed).toBe(1);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should skip duplicate PE ratios', async () => {
      const stocks = [
        { id: 'stock-1', symbol: 'AAPL' },
      ];

      jest.spyOn(prisma.stock, 'findMany').mockResolvedValue(stocks as any);

      jest
        .spyOn(FinnhubClient.prototype, 'getBasicFinancials' as any)
        .mockResolvedValue({
          metric: {
            '10P': 25.5,
          },
        });

      jest.spyOn(prisma.pERatio, 'findUnique').mockResolvedValue({
        id: 'existing-pe',
        stockId: 'stock-1',
        ratio: 25.5,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const createSpy = jest
        .spyOn(prisma.pERatio, 'create');

      const stats = await etlService.fetchAndStoreFundamentals();

      expect(stats.fundamentalsProcessed).toBe(1);
      expect(createSpy).not.toHaveBeenCalled();
    });
  });

  describe('fetchAndStoreHistoricalPrices', () => {
    it('should fetch and store historical prices', async () => {
      const stocks = [
        { id: 'stock-1', symbol: 'AAPL' },
      ];

      jest.spyOn(prisma.stock, 'findMany').mockResolvedValue(stocks as any);

      const mockCandles = {
        c: [150.5, 151.2],
        h: [152, 153],
        l: [150, 150.5],
        o: [150.1, 151],
        v: [1000000, 2000000],
        t: [
          Math.floor(Date.now() / 1000) - 86400,
          Math.floor(Date.now() / 1000),
        ],
      };

      jest
        .spyOn(FinnhubClient.prototype, 'getCandles' as any)
        .mockResolvedValue(mockCandles);

      const upsertSpy = jest
        .spyOn(prisma.historicalPrice, 'upsert')
        .mockResolvedValue({
          id: 'price-1',
          stockId: 'stock-1',
          open: 150.1,
          high: 152,
          low: 150,
          close: 150.5,
          volume: 1000000,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      const stats = await etlService.fetchAndStoreHistoricalPrices(730);

      expect(stats.pricesProcessed).toBe(1);
      expect(upsertSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle missing price data', async () => {
      const stocks = [
        { id: 'stock-1', symbol: 'AAPL' },
      ];

      jest.spyOn(prisma.stock, 'findMany').mockResolvedValue(stocks as any);

      jest
        .spyOn(FinnhubClient.prototype, 'getCandles' as any)
        .mockResolvedValue(null);

      const upsertSpy = jest
        .spyOn(prisma.historicalPrice, 'upsert');

      const stats = await etlService.fetchAndStoreHistoricalPrices(730);

      expect(stats.pricesProcessed).toBe(1);
      expect(upsertSpy).not.toHaveBeenCalled();
    });
  });

  describe('stats', () => {
    it('should track statistics', async () => {
      const stats = etlService.getStats();

      expect(stats).toHaveProperty('symbolsProcessed', 0);
      expect(stats).toHaveProperty('symbolsCreated', 0);
      expect(stats).toHaveProperty('fundamentalsProcessed', 0);
      expect(stats).toHaveProperty('pricesProcessed', 0);
      expect(stats).toHaveProperty('errors', 0);
    });
  });
});
