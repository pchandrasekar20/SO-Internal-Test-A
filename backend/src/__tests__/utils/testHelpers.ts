import { Application } from 'express';
import request from 'supertest';
import prisma from '@/db/client';

export function createTestClient(app: Application) {
  return request(app);
}

export async function cleanDatabase() {
  const tables = ['HistoricalPrice', 'PERatio', 'Stock'];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
  }
}

export async function createTestStock(
  symbol: string,
  name: string,
  sector?: string,
  industry?: string
) {
  return prisma.stock.create({
    data: {
      symbol,
      name,
      sector,
      industry,
    },
  });
}

export async function createTestPERatio(
  stockId: string,
  ratio: number,
  date: Date = new Date()
) {
  return prisma.pERatio.create({
    data: {
      stockId,
      ratio,
      date,
    },
  });
}

export async function createTestHistoricalPrice(
  stockId: string,
  close: number,
  open: number = close,
  high: number = close,
  low: number = close,
  volume: number = 1000000,
  date: Date = new Date()
) {
  return prisma.historicalPrice.create({
    data: {
      stockId,
      open,
      high,
      low,
      close,
      volume,
      date,
    },
  });
}
