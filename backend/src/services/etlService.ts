import prisma from '@/db/client';
import logger from '@/utils/logger';
import RateLimiter from '@/utils/rateLimiter';
import FinnhubClient, { FinnhubSymbolResult } from './finnhubClient';
import AlphaVantageClient from './alphaVantageClient';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || '';
const ETL_BATCH_SIZE = parseInt(process.env.ETL_BATCH_SIZE || '10', 10);
const ETL_RATE_LIMIT_MS = parseInt(process.env.ETL_RATE_LIMIT_MS || '100', 10);

export interface ETLStats {
  symbolsProcessed: number;
  symbolsCreated: number;
  fundamentalsProcessed: number;
  pricesProcessed: number;
  errors: number;
  startTime: Date;
  endTime: Date;
}

export class ETLService {
  private finnhubClient: FinnhubClient;
  private alphaVantageClient: AlphaVantageClient;
  private rateLimiter: RateLimiter;
  private stats: ETLStats;

  constructor() {
    this.finnhubClient = new FinnhubClient(FINNHUB_API_KEY);
    this.alphaVantageClient = new AlphaVantageClient(ALPHA_VANTAGE_API_KEY);
    this.rateLimiter = new RateLimiter(ETL_RATE_LIMIT_MS, 1);
    this.stats = {
      symbolsProcessed: 0,
      symbolsCreated: 0,
      fundamentalsProcessed: 0,
      pricesProcessed: 0,
      errors: 0,
      startTime: new Date(),
      endTime: new Date(),
    };
  }

  async fetchAndStoreSymbols(exchange: string = 'US'): Promise<ETLStats> {
    logger.info(`Starting symbol fetch from Finnhub for exchange: ${exchange}`);
    this.stats.startTime = new Date();

    try {
      const symbols = await this.rateLimiter.execute(() =>
        this.finnhubClient.getSymbols(exchange)
      );

      if (!symbols || symbols.length === 0) {
        logger.warn('No symbols returned from Finnhub');
        this.stats.endTime = new Date();
        return this.stats;
      }

      logger.info(`Fetched ${symbols.length} symbols from Finnhub`);

      const usSymbols = symbols.filter(
        (s) => s.type === 'Common Stock' && s.displaySymbol
      );
      logger.info(`Filtered to ${usSymbols.length} common stocks`);

      for (let i = 0; i < usSymbols.length; i += ETL_BATCH_SIZE) {
        const batch = usSymbols.slice(i, i + ETL_BATCH_SIZE);
        await Promise.all(batch.map((symbol) => this.storeSymbol(symbol)));
        logger.info(
          `Processed ${Math.min(i + ETL_BATCH_SIZE, usSymbols.length)}/${usSymbols.length} symbols`
        );
      }

      this.stats.symbolsProcessed = usSymbols.length;
      logger.info('Symbol fetch completed successfully');
    } catch (error) {
      logger.error(`Symbol fetch failed: ${error}`);
      this.stats.errors++;
    }

    this.stats.endTime = new Date();
    return this.stats;
  }

  private async storeSymbol(symbol: FinnhubSymbolResult): Promise<void> {
    try {
      const existing = await prisma.stock.findUnique({
        where: { symbol: symbol.displaySymbol },
      });

      if (!existing) {
        await prisma.stock.create({
          data: {
            symbol: symbol.displaySymbol,
            name: symbol.description,
          },
        });
        this.stats.symbolsCreated++;
        logger.debug(`Created stock: ${symbol.displaySymbol}`);
      }
    } catch (error) {
      logger.error(
        `Failed to store symbol ${symbol.displaySymbol}: ${error}`
      );
      this.stats.errors++;
    }
  }

  async fetchAndStoreFundamentals(): Promise<ETLStats> {
    logger.info('Starting fundamentals fetch');
    this.stats.startTime = new Date();

    try {
      const stocks = await prisma.stock.findMany({
        select: { id: true, symbol: true },
      });

      logger.info(`Processing fundamentals for ${stocks.length} stocks`);

      for (let i = 0; i < stocks.length; i += ETL_BATCH_SIZE) {
        const batch = stocks.slice(i, i + ETL_BATCH_SIZE);
        await Promise.all(batch.map((stock: any) => this.storeFundamentals(stock)));
        logger.info(
          `Processed ${Math.min(i + ETL_BATCH_SIZE, stocks.length)}/${stocks.length} stocks`
        );
      }

      this.stats.fundamentalsProcessed = stocks.length;
      logger.info('Fundamentals fetch completed successfully');
    } catch (error) {
      logger.error(`Fundamentals fetch failed: ${error}`);
      this.stats.errors++;
    }

    this.stats.endTime = new Date();
    return this.stats;
  }

  private async storeFundamentals(stock: {
    id: string;
    symbol: string;
  }): Promise<void> {
    try {
      const data = await this.rateLimiter.execute(() =>
        this.finnhubClient.getBasicFinancials(stock.symbol)
      );

      if (!data || !data.metric) {
        logger.debug(`No fundamentals data for ${stock.symbol}`);
        return;
      }

      const metric = data.metric;
      const peRatio = metric['10P'] || metric['P/E'] || null;

      if (peRatio && peRatio > 0) {
        const date = new Date();
        date.setUTCHours(0, 0, 0, 0);

        const existingPE = await prisma.pERatio.findUnique({
          where: {
            stockId_date: {
              stockId: stock.id,
              date,
            },
          },
        });

        if (!existingPE) {
          await prisma.pERatio.create({
            data: {
              stockId: stock.id,
              ratio: peRatio,
              date,
            },
          });
          logger.debug(`Stored PE ratio for ${stock.symbol}: ${peRatio}`);
        }
      }

      const marketCap = metric['marketCapitalization'] || null;
      if (marketCap && marketCap > 0) {
        await prisma.stock.update({
          where: { id: stock.id },
          data: {
            marketCap: Math.floor(marketCap / 1000000),
          },
        });
      }
    } catch (error) {
      logger.warn(`Failed to store fundamentals for ${stock.symbol}: ${error}`);
      this.stats.errors++;
    }
  }

  async fetchAndStoreHistoricalPrices(
    days: number = 730
  ): Promise<ETLStats> {
    logger.info(
      `Starting historical prices fetch for last ${days} days`
    );
    this.stats.startTime = new Date();

    try {
      const stocks = await prisma.stock.findMany({
        select: { id: true, symbol: true },
      });

      logger.info(`Processing prices for ${stocks.length} stocks`);

      for (let i = 0; i < stocks.length; i += ETL_BATCH_SIZE) {
        const batch = stocks.slice(i, i + ETL_BATCH_SIZE);
        await Promise.all(
          batch.map((stock: any) => this.storeHistoricalPrices(stock, days))
        );
        logger.info(
          `Processed ${Math.min(i + ETL_BATCH_SIZE, stocks.length)}/${stocks.length} stocks`
        );
      }

      this.stats.pricesProcessed = stocks.length;
      logger.info('Historical prices fetch completed successfully');
    } catch (error) {
      logger.error(`Historical prices fetch failed: ${error}`);
      this.stats.errors++;
    }

    this.stats.endTime = new Date();
    return this.stats;
  }

  private async storeHistoricalPrices(
    stock: { id: string; symbol: string },
    days: number
  ): Promise<void> {
    try {
      const toDate = Math.floor(Date.now() / 1000);
      const fromDate = Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);

      const candles = await this.rateLimiter.execute(() =>
        this.finnhubClient.getCandles(stock.symbol, 'D', fromDate, toDate)
      );

      if (!candles || !candles.c || candles.c.length === 0) {
        logger.debug(`No price data for ${stock.symbol}`);
        return;
      }

      const prices = [];
      for (let i = 0; i < candles.c.length; i++) {
        const date = new Date(candles.t[i] * 1000);
        date.setUTCHours(0, 0, 0, 0);

        const price = {
          stockId: stock.id,
          open: candles.o[i],
          high: candles.h[i],
          low: candles.l[i],
          close: candles.c[i],
          volume: candles.v[i],
          date,
        };

        prices.push(price);
      }

      await this.upsertHistoricalPrices(stock.id, prices);
      logger.debug(
        `Stored ${prices.length} price records for ${stock.symbol}`
      );
    } catch (error) {
      logger.warn(
        `Failed to store historical prices for ${stock.symbol}: ${error}`
      );
      this.stats.errors++;
    }
  }

  private async upsertHistoricalPrices(
    stockId: string,
    prices: Array<{
      stockId: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
      date: Date;
    }>
  ): Promise<void> {
    for (const price of prices) {
      try {
        await prisma.historicalPrice.upsert({
          where: {
            stockId_date: {
              stockId,
              date: price.date,
            },
          },
          update: {
            open: price.open,
            high: price.high,
            low: price.low,
            close: price.close,
            volume: price.volume,
          },
          create: price,
        });
      } catch (error) {
        logger.error(
          `Failed to upsert price for ${stockId} on ${price.date}: ${error}`
        );
      }
    }
  }

  getStats(): ETLStats {
    return this.stats;
  }
}

export default ETLService;
