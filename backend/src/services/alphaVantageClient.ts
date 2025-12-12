import axios, { AxiosInstance } from 'axios';
import logger from '@/utils/logger';

export interface AlphaVantageTimeSeriesData {
  [date: string]: {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  };
}

export interface AlphaVantageQuoteData {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
  };
}

export interface AlphaVantageCompanyData {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
  };
}

export class AlphaVantageClient {
  private client: AxiosInstance;
  private apiKey: string;
  private baseURL = 'https://www.alphavantage.co/query';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  async getDailyTimeSeries(
    symbol: string,
    outputSize: string = 'full'
  ): Promise<AlphaVantageTimeSeriesData | null> {
    try {
      const response = await this.client.get('/', {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol,
          outputsize: outputSize,
          apikey: this.apiKey,
        },
      });

      if (response.data && response.data['Time Series (Daily)']) {
        return response.data['Time Series (Daily)'];
      }
      return null;
    } catch (error) {
      logger.warn(`Failed to fetch daily time series for ${symbol}: ${error}`);
      return null;
    }
  }

  async getGlobalQuote(symbol: string): Promise<AlphaVantageQuoteData | null> {
    try {
      const response = await this.client.get('/', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: this.apiKey,
        },
      });

      if (response.data && response.data['Global Quote']) {
        return response.data;
      }
      return null;
    } catch (error) {
      logger.warn(`Failed to fetch global quote for ${symbol}: ${error}`);
      return null;
    }
  }
}

export default AlphaVantageClient;
