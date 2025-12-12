import prisma from '@/db/client';
import { NotFoundError, InternalServerError } from '@/utils/errors';
import { PaginationParams, createPaginatedResponse } from '@/utils/pagination';
import { SortOrder } from '@/utils/validation';

export interface StockWithPERatio {
  id: string;
  symbol: string;
  name: string;
  sector: string | null;
  industry: string | null;
  peRatio: number;
}

export interface StockWithPriceChange {
  id: string;
  symbol: string;
  name: string;
  sector: string | null;
  industry: string | null;
  priceChange: number;
}

export async function getStocksWithLowestPE(
  pagination: PaginationParams,
  sortBy: string,
  sortOrder: SortOrder,
  filters: Record<string, string | undefined>
) {
  try {
    const where: Record<string, unknown> = {};

    if (filters.sector) {
      where.sector = filters.sector;
    }
    if (filters.industry) {
      where.industry = filters.industry;
    }

    const orderBy: any = {};
    if (sortBy === 'peRatio') {
      orderBy.peRatio = { _min: sortOrder };
    } else if (sortBy === 'symbol') {
      orderBy.symbol = sortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else {
      orderBy.peRatio = { _min: sortOrder };
    }

    const stocks = await prisma.stock.findMany({
      where,
      select: {
        id: true,
        symbol: true,
        name: true,
        sector: true,
        industry: true,
        peRatio: {
          orderBy: { date: 'desc' as const },
          take: 1,
          select: { ratio: true },
        },
      },
      orderBy,
      skip: pagination.offset,
      take: pagination.limit,
    });

    const total = await prisma.stock.count({ where });

    const formattedStocks: StockWithPERatio[] = stocks
      .filter((s: any) => s.peRatio.length > 0)
      .map((s: any) => ({
        id: s.id,
        symbol: s.symbol,
        name: s.name,
        sector: s.sector,
        industry: s.industry,
        peRatio: s.peRatio[0].ratio,
      }));

    return createPaginatedResponse(
      formattedStocks,
      total,
      pagination.page,
      pagination.limit
    );
  } catch (error) {
    throw new InternalServerError('Failed to fetch stocks with low PE ratio');
  }
}

export async function getStocksWithLargestDeclines(
  pagination: PaginationParams,
  sortBy: string,
  sortOrder: SortOrder,
  filters: Record<string, string | undefined>
) {
  try {
    const where: Record<string, unknown> = {};

    if (filters.sector) {
      where.sector = filters.sector;
    }
    if (filters.industry) {
      where.industry = filters.industry;
    }

    const stocks = await prisma.stock.findMany({
      where,
      select: {
        id: true,
        symbol: true,
        name: true,
        sector: true,
        industry: true,
        historicalPrice: {
          orderBy: { date: 'desc' as const },
          take: 2,
          select: { close: true, date: true },
        },
      },
      skip: pagination.offset,
      take: pagination.limit,
    });

    const total = await prisma.stock.count({ where });

    const formattedStocks: StockWithPriceChange[] = stocks
      .filter((s: any) => s.historicalPrice.length >= 2)
      .map((s: any) => {
        const [latest, previous] = s.historicalPrice;
        const priceChange =
          ((latest.close - previous.close) / previous.close) * 100;

        return {
          id: s.id,
          symbol: s.symbol,
          name: s.name,
          sector: s.sector,
          industry: s.industry,
          priceChange,
        };
      })
      .sort((a: any, b: any) => {
        if (sortBy === 'priceChange') {
          return sortOrder === 'asc'
            ? a.priceChange - b.priceChange
            : b.priceChange - a.priceChange;
        } else if (sortBy === 'symbol') {
          return sortOrder === 'asc'
            ? a.symbol.localeCompare(b.symbol)
            : b.symbol.localeCompare(a.symbol);
        } else if (sortBy === 'name') {
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        return 0;
      })
      .slice(pagination.offset, pagination.offset + pagination.limit);

    return createPaginatedResponse(
      formattedStocks,
      total,
      pagination.page,
      pagination.limit
    );
  } catch (error) {
    throw new InternalServerError('Failed to fetch stocks with largest declines');
  }
}
