import { Request, Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import {
  getStocksWithLowestPE,
  getStocksWithLargestDeclines,
} from '@/services/stocksService';
import {
  validateStockQueryParams,
  StockQueryParams,
} from '@/utils/validation';
import { parsePaginationParams } from '@/utils/pagination';

export const getLowestPEStocks = asyncHandler(
  async (req: Request, res: Response) => {
    const queryParams: StockQueryParams = {
      page: req.query.page as string | number | undefined,
      limit: req.query.limit as string | number | undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string,
      sector: req.query.sector as string,
      industry: req.query.industry as string,
    };

    const validated = validateStockQueryParams('low-pe', queryParams);
    const pagination = parsePaginationParams(
      validated.page,
      validated.limit
    );

    const result = await getStocksWithLowestPE(
      pagination,
      validated.sortBy,
      validated.sortOrder,
      validated.filters
    );

    res.status(200).json(result);
  }
);

export const getLargestDeclinesStocks = asyncHandler(
  async (req: Request, res: Response) => {
    const queryParams: StockQueryParams = {
      page: req.query.page as string | number | undefined,
      limit: req.query.limit as string | number | undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string,
      sector: req.query.sector as string,
      industry: req.query.industry as string,
    };

    const validated = validateStockQueryParams('largest-declines', queryParams);
    const pagination = parsePaginationParams(
      validated.page,
      validated.limit
    );

    const result = await getStocksWithLargestDeclines(
      pagination,
      validated.sortBy,
      validated.sortOrder,
      validated.filters
    );

    res.status(200).json(result);
  }
);
