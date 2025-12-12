import { StockWithPERatio, StockWithPriceChange, PaginatedResponse, QueryParams } from './types';
export declare const stocksApi: {
    getLowestPEStocks: (params?: QueryParams) => Promise<PaginatedResponse<StockWithPERatio>>;
    getLargestDeclinesStocks: (params?: QueryParams) => Promise<PaginatedResponse<StockWithPriceChange>>;
    getHealth: () => Promise<{
        status: string;
    }>;
};
