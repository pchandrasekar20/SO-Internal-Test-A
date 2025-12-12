import 'dotenv/config';
import logger from '@/utils/logger';
import ETLService from '@/services/etlService';

async function main() {
  try {
    const days = parseInt(process.argv[2] || '730', 10);
    logger.info('Starting full ETL pipeline');
    logger.info(`  Step 1: Fetch and store stock symbols`);
    logger.info(`  Step 2: Fetch and store fundamentals (PE ratios, market cap)`);
    logger.info(`  Step 3: Fetch and store historical prices (last ${days} days)`);

    const etl = new ETLService();
    const startTime = Date.now();

    logger.info('Step 1: Symbols');
    let stats = await etl.fetchAndStoreSymbols('US');
    logger.info(`  ✓ Completed: ${stats.symbolsCreated}/${stats.symbolsProcessed} symbols created`);

    logger.info('Step 2: Fundamentals');
    stats = await etl.fetchAndStoreFundamentals();
    logger.info(`  ✓ Completed: ${stats.fundamentalsProcessed} stocks processed`);

    logger.info('Step 3: Historical Prices');
    stats = await etl.fetchAndStoreHistoricalPrices(days);
    logger.info(`  ✓ Completed: ${stats.pricesProcessed} stocks processed`);

    const totalDuration = (Date.now() - startTime) / 1000;
    logger.info('Full ETL pipeline completed successfully');
    logger.info(`  Total duration: ${totalDuration}s`);
    logger.info(`  Total errors: ${stats.errors}`);

    process.exit(0);
  } catch (error) {
    logger.error(`Full ETL pipeline failed: ${error}`);
    process.exit(1);
  }
}

main();
