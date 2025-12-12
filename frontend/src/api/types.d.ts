export interface Stock {
    id: string;
    symbol: string;
    name: string;
    sector: string | null;
    industry: string | null;
}
export interface StockWithPERatio extends Stock {
    peRatio: number;
}
export interface StockWithPriceChange extends Stock {
    priceChange: number;
}
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationInfo;
}
export interface QueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    sector?: string;
    industry?: string;
    search?: string;
}
