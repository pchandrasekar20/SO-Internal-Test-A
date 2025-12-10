import prisma from '@/db/client';
import logger from '@/utils/logger';

const stocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    marketCap: 2800000000000,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Software',
    marketCap: 2500000000000,
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co',
    sector: 'Finance',
    industry: 'Banking',
    marketCap: 450000000000,
  },
  {
    symbol: 'BAC',
    name: 'Bank of America Corp',
    sector: 'Finance',
    industry: 'Banking',
    marketCap: 320000000000,
  },
  {
    symbol: 'KO',
    name: 'The Coca-Cola Company',
    sector: 'Consumer Staples',
    industry: 'Beverages',
    marketCap: 280000000000,
  },
];

async function seed() {
  try {
    logger.info('Starting database seed...');

    for (const stock of stocks) {
      const created = await prisma.stock.upsert({
        where: { symbol: stock.symbol },
        update: stock,
        create: stock,
      });

      const baseDate = new Date();

      await prisma.pERatio.upsert({
        where: {
          stockId_date: {
            stockId: created.id,
            date: baseDate,
          },
        },
        update: {
          ratio: Math.random() * 30 + 5,
        },
        create: {
          stockId: created.id,
          ratio: Math.random() * 30 + 5,
          date: baseDate,
        },
      });

      const prices = [150 + Math.random() * 50, 140 + Math.random() * 50];
      for (let i = 0; i < prices.length; i++) {
        const date = new Date(baseDate.getTime() - i * 24 * 60 * 60 * 1000);
        const price = prices[i];

        await prisma.historicalPrice.upsert({
          where: {
            stockId_date: {
              stockId: created.id,
              date,
            },
          },
          update: {
            close: price,
            open: price,
            high: price + 5,
            low: price - 5,
            volume: 10000000,
          },
          create: {
            stockId: created.id,
            close: price,
            open: price,
            high: price + 5,
            low: price - 5,
            volume: 10000000,
            date,
          },
        });
      }

      logger.info(`Seeded stock: ${stock.symbol}`);
    }

    logger.info('Database seeding completed');
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
