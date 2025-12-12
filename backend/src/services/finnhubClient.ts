import axios, { AxiosInstance } from 'axios';
import logger from '@/utils/logger';

export interface FinnhubSymbolResult {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
  mic?: string;
  currency?: string;
}

export interface FinnhubQuoteData {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface FinnhubCompanyData {
  country: string;
  currency: string;
  estimatedRevenue: number;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
}

export interface FinnhubFundamentalsData {
  netIncome: number;
  eps: number;
  peRatio: number;
  bookValue: number;
  priceToBook: number;
}

export class FinnhubClient {
  private client: AxiosInstance;
  private apiKey: string;
  private baseURL = 'https://finnhub.io/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  async getSymbols(exchange: string = 'US'): Promise<FinnhubSymbolResult[]> {
    try {
      const response = await this.client.get('/stock/symbol', {
        params: {
          exchange,
          token: this.apiKey,
        },
      });
      return response.data || [];
    } catch (error) {
      logger.error(`Failed to fetch symbols from Finnhub: ${error}`);
      throw error;
    }
  }

  async getQuote(symbol: string): Promise<FinnhubQuoteData | null> {
    try {
      const response = await this.client.get('/quote', {
        params: {
          symbol,
          token: this.apiKey,
        },
      });

      if (response.data && response.data.c) {
        return response.data;
      }
      return null;
    } catch (error) {
      logger.warn(`Failed to fetch quote for ${symbol}: ${error}`);
      return null;
    }
  }

  async getCompanyProfile(symbol: string): Promise<FinnhubCompanyData | null> {
    try {
      const response = await this.client.get('/stock/profile2', {
        params: {
          symbol,
          token: this.apiKey,
        },
      });

      if (response.data && response.data.ticker) {
        return response.data;
      }
      return null;
    } catch (error) {
      logger.warn(`Failed to fetch company profile for ${symbol}: ${error}`);
      return null;
    }
  }

  async getCandles(
    symbol: string,
    resolution: string = 'D',
    from: number,
    to: number
  ): Promise<any> {
    try {
      const response = await this.client.get('/stock/candle', {
        params: {
          symbol,
          resolution,
          from,
          to,
          token: this.apiKey,
        },
      });

      if (response.data && response.data.c && Array.isArray(response.data.c)) {
        return response.data;
      }
      return null;
    } catch (error) {
      logger.warn(`Failed to fetch candles for ${symbol}: ${error}`);
      return null;
    }
  }

  async getBasicFinancials(
    symbol: string,
    metric: string = 'all'
  ): Promise<any> {
    try {
      const response = await this.client.get('/fundamental/metric', {
        params: {
          symbol,
          metric,
          token: this.apiKey,
        },
      });

      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      logger.warn(
        `Failed to fetch basic financials for ${symbol}: ${error}`
      );
      return null;
    }
  }
}

export default FinnhubClient;
