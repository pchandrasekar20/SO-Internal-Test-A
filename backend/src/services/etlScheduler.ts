import logger from '@/utils/logger';
import ETLService from './etlService';

export class ETLScheduler {
  private etl: ETLService;
  private isRunning: boolean = false;

  constructor() {
    this.etl = new ETLService();
  }

  async runFullPipeline(daysForPrices: number = 730): Promise<void> {
    if (this.isRunning) {
      logger.warn('ETL pipeline already running, skipping this execution');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      logger.info('Starting scheduled full ETL pipeline');

      logger.info('Step 1: Fetching stock symbols');
      await this.etl.fetchAndStoreSymbols('US');

      logger.info('Step 2: Fetching fundamentals');
      await this.etl.fetchAndStoreFundamentals();

      logger.info(
        `Step 3: Fetching historical prices (${daysForPrices} days)`
      );
      await this.etl.fetchAndStoreHistoricalPrices(daysForPrices);

      const duration = (Date.now() - startTime) / 1000;
      logger.info(`Full ETL pipeline completed successfully in ${duration}s`);
    } catch (error) {
      logger.error(`Full ETL pipeline failed: ${error}`);
    } finally {
      this.isRunning = false;
    }
  }

  async runSymbolsOnly(): Promise<void> {
    if (this.isRunning) {
      logger.warn('ETL pipeline already running, skipping this execution');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      logger.info('Starting scheduled symbol fetch');
      await this.etl.fetchAndStoreSymbols('US');
      const duration = (Date.now() - startTime) / 1000;
      logger.info(`Symbol fetch completed in ${duration}s`);
    } catch (error) {
      logger.error(`Symbol fetch failed: ${error}`);
    } finally {
      this.isRunning = false;
    }
  }

  async runFundamentalsOnly(): Promise<void> {
    if (this.isRunning) {
      logger.warn('ETL pipeline already running, skipping this execution');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      logger.info('Starting scheduled fundamentals fetch');
      await this.etl.fetchAndStoreFundamentals();
      const duration = (Date.now() - startTime) / 1000;
      logger.info(`Fundamentals fetch completed in ${duration}s`);
    } catch (error) {
      logger.error(`Fundamentals fetch failed: ${error}`);
    } finally {
      this.isRunning = false;
    }
  }

  async runPricesOnly(daysForPrices: number = 30): Promise<void> {
    if (this.isRunning) {
      logger.warn('ETL pipeline already running, skipping this execution');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      logger.info(`Starting scheduled prices fetch (${daysForPrices} days)`);
      await this.etl.fetchAndStoreHistoricalPrices(daysForPrices);
      const duration = (Date.now() - startTime) / 1000;
      logger.info(`Prices fetch completed in ${duration}s`);
    } catch (error) {
      logger.error(`Prices fetch failed: ${error}`);
    } finally {
      this.isRunning = false;
    }
  }

  isETLRunning(): boolean {
    return this.isRunning;
  }
}

export default ETLScheduler;
