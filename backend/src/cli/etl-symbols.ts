import 'dotenv/config';
import logger from '@/utils/logger';
import ETLService from '@/services/etlService';

async function main() {
  try {
    logger.info('Starting symbol ETL job');
    const etl = new ETLService();
    const stats = await etl.fetchAndStoreSymbols('US');

    logger.info('Symbol ETL job completed:');
    logger.info(`  Symbols processed: ${stats.symbolsProcessed}`);
    logger.info(`  Symbols created: ${stats.symbolsCreated}`);
    logger.info(`  Errors: ${stats.errors}`);
    logger.info(
      `  Duration: ${(stats.endTime.getTime() - stats.startTime.getTime()) / 1000}s`
    );

    process.exit(0);
  } catch (error) {
    logger.error(`Symbol ETL job failed: ${error}`);
    process.exit(1);
  }
}

main();
