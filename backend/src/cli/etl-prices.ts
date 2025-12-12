import 'dotenv/config';
import logger from '@/utils/logger';
import ETLService from '@/services/etlService';

async function main() {
  try {
    const days = parseInt(process.argv[2] || '730', 10);
    logger.info(`Starting prices ETL job for last ${days} days`);
    const etl = new ETLService();
    const stats = await etl.fetchAndStoreHistoricalPrices(days);

    logger.info('Prices ETL job completed:');
    logger.info(`  Stocks processed: ${stats.pricesProcessed}`);
    logger.info(`  Errors: ${stats.errors}`);
    logger.info(
      `  Duration: ${(stats.endTime.getTime() - stats.startTime.getTime()) / 1000}s`
    );

    process.exit(0);
  } catch (error) {
    logger.error(`Prices ETL job failed: ${error}`);
    process.exit(1);
  }
}

main();
