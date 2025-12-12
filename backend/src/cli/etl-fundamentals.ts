import 'dotenv/config';
import logger from '@/utils/logger';
import ETLService from '@/services/etlService';

async function main() {
  try {
    logger.info('Starting fundamentals ETL job');
    const etl = new ETLService();
    const stats = await etl.fetchAndStoreFundamentals();

    logger.info('Fundamentals ETL job completed:');
    logger.info(`  Stocks processed: ${stats.fundamentalsProcessed}`);
    logger.info(`  Errors: ${stats.errors}`);
    logger.info(
      `  Duration: ${(stats.endTime.getTime() - stats.startTime.getTime()) / 1000}s`
    );

    process.exit(0);
  } catch (error) {
    logger.error(`Fundamentals ETL job failed: ${error}`);
    process.exit(1);
  }
}

main();
