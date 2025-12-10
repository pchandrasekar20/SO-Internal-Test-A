import { ValidationError } from './errors';

export type SortOrder = 'asc' | 'desc';

export interface StockQueryParams {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
  sector?: string;
  industry?: string;
}

const VALID_SORT_FIELDS = {
  'low-pe': ['peRatio', 'symbol', 'name'],
  'largest-declines': ['priceChange', 'symbol', 'name'],
};

export function validateStockQueryParams(
  endpoint: 'low-pe' | 'largest-declines',
  params: StockQueryParams
): {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
  filters: Record<string, string | undefined>;
} {
  const page = Math.max(1, parseInt(String(params.page || '1')));
  const limit = Math.max(1, Math.min(100, parseInt(String(params.limit || '25'))));

  if (isNaN(page) || isNaN(limit)) {
    throw new ValidationError('page and limit must be valid integers');
  }

  let sortBy = params.sortBy || 'peRatio';
  if (endpoint === 'largest-declines') {
    sortBy = params.sortBy || 'priceChange';
  }

  const validSortFields = VALID_SORT_FIELDS[endpoint];
  if (!validSortFields.includes(sortBy)) {
    throw new ValidationError(
      `Invalid sortBy. Allowed values: ${validSortFields.join(', ')}`
    );
  }

  const sortOrder = (params.sortOrder?.toLowerCase() || 'asc') as SortOrder;
  if (!['asc', 'desc'].includes(sortOrder)) {
    throw new ValidationError('sortOrder must be asc or desc');
  }

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    filters: {
      sector: params.sector,
      industry: params.industry,
    },
  };
}
