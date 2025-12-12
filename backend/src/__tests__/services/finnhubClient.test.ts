import axios from 'axios';
import FinnhubClient from '@/services/finnhubClient';
import logger from '@/utils/logger';

jest.mock('axios');
jest.mock('@/utils/logger');

describe('FinnhubClient', () => {
  let client: FinnhubClient;
  const mockAxios = axios.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new FinnhubClient('test-api-key');
  });

  describe('getSymbols', () => {
    it('should fetch symbols from Finnhub', async () => {
      const mockSymbols = [
        {
          symbol: 'AAPL',
          description: 'Apple Inc',
          displaySymbol: 'AAPL',
          type: 'Common Stock',
        },
        {
          symbol: 'MSFT',
          description: 'Microsoft Corporation',
          displaySymbol: 'MSFT',
          type: 'Common Stock',
        },
      ];

      mockAxios.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockSymbols }),
      });

      client = new FinnhubClient('test-api-key');
      const symbols = await client.getSymbols('US');

      expect(symbols).toEqual(mockSymbols);
    });

    it('should return empty array if no data returned', async () => {
      mockAxios.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: null }),
      });

      client = new FinnhubClient('test-api-key');
      const symbols = await client.getSymbols('US');

      expect(symbols).toEqual([]);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockAxios.mockReturnValue({
        get: jest.fn().mockRejectedValue(error),
      });

      client = new FinnhubClient('test-api-key');

      await expect(client.getSymbols('US')).rejects.toThrow('API Error');
    });
  });

  describe('getQuote', () => {
    it('should fetch quote for symbol', async () => {
      const mockQuote = {
        c: 150.5,
        h: 152,
        l: 150,
        o: 150.1,
        pc: 149.8,
        t: 1640880000,
      };

      mockAxios.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockQuote }),
      });

      client = new FinnhubClient('test-api-key');
      const quote = await client.getQuote('AAPL');

      expect(quote).toEqual(mockQuote);
    });

    it('should return null if quote data is missing', async () => {
      mockAxios.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { c: null } }),
      });

      client = new FinnhubClient('test-api-key');
      const quote = await client.getQuote('AAPL');

      expect(quote).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockAxios.mockReturnValue({
        get: jest.fn().mockRejectedValue(error),
      });

      client = new FinnhubClient('test-api-key');
      const quote = await client.getQuote('AAPL');

      expect(quote).toBeNull();
    });
  });

  describe('getCompanyProfile', () => {
    it('should fetch company profile', async () => {
      const mockProfile = {
        country: 'US',
        currency: 'USD',
        estimatedRevenue: 365000000000,
        finnhubIndustry: 'Technology',
        ipo: '1980-12-12',
        logo: 'https://example.com/logo.png',
        marketCapitalization: 2800000000000,
        name: 'Apple Inc',
        phone: '+1-408-996-1010',
        shareOutstanding: 16700000000,
        ticker: 'AAPL',
        weburl: 'https://www.apple.com',
      };

      mockAxios.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockProfile }),
      });

      client = new FinnhubClient('test-api-key');
      const profile = await client.getCompanyProfile('AAPL');

      expect(profile).toEqual(mockProfile);
    });

    it('should return null if ticker is missing', async () => {
      mockAxios.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: {} }),
      });

      client = new FinnhubClient('test-api-key');
      const profile = await client.getCompanyProfile('AAPL');

      expect(profile).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockAxios.mockReturnValue({
        get: jest.fn().mockRejectedValue(error),
      });

      client = new FinnhubClient('test-api-key');
      const profile = await client.getCompanyProfile('AAPL');

      expect(profile).toBeNull();
    });
  });

  describe('getCandles', () => {
    it('should fetch candlestick data', async () => {
      const mockCandles = {
        c: [150.5, 151.2, 150.8],
        h: [152, 153, 152.5],
        l: [150, 150.5, 150],
        o: [150.1, 151, 151],
        v: [1000000, 2000000, 1500000],
        t: [1640880000, 1640966400, 1641052800],
      };

      mockAxios.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockCandles }),
      });

      client = new FinnhubClient('test-api-key');
      const candles = await client.getCandles(
        'AAPL',
        'D',
        1640880000,
        1641052800
      );

      expect(candles).toEqual(mockCandles);
    });

    it('should return null if no price data', async () => {
      mockAxios.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: { c: null } }),
      });

      client = new FinnhubClient('test-api-key');
      const candles = await client.getCandles(
        'AAPL',
        'D',
        1640880000,
        1641052800
      );

      expect(candles).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockAxios.mockReturnValue({
        get: jest.fn().mockRejectedValue(error),
      });

      client = new FinnhubClient('test-api-key');
      const candles = await client.getCandles(
        'AAPL',
        'D',
        1640880000,
        1641052800
      );

      expect(candles).toBeNull();
    });
  });

  describe('getBasicFinancials', () => {
    it('should fetch basic financials', async () => {
      const mockFinancials = {
        metric: {
          '10P': 25.5,
          'P/E': 25.5,
          marketCapitalization: 2800000000000,
          shareOutstanding: 16700000000,
        },
        series: {
          annual: {
            eps: { 2021: 5.92 },
            netIncome: { 2021: 94736000000 },
          },
        },
      };

      mockAxios.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockFinancials }),
      });

      client = new FinnhubClient('test-api-key');
      const financials = await client.getBasicFinancials('AAPL');

      expect(financials).toEqual(mockFinancials);
    });

    it('should return null if no data returned', async () => {
      mockAxios.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: null }),
      });

      client = new FinnhubClient('test-api-key');
      const financials = await client.getBasicFinancials('AAPL');

      expect(financials).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockAxios.mockReturnValue({
        get: jest.fn().mockRejectedValue(error),
      });

      client = new FinnhubClient('test-api-key');
      const financials = await client.getBasicFinancials('AAPL');

      expect(financials).toBeNull();
    });
  });
});
