export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function parsePaginationParams(
  page?: string | number,
  limit?: string | number
): PaginationParams {
  const p = Math.max(1, parseInt(String(page || '1')));
  const l = Math.max(1, Math.min(100, parseInt(String(limit || '25'))));

  return {
    page: p,
    limit: l,
    offset: (p - 1) * l,
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
