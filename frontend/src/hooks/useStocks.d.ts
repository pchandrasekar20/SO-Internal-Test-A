import { QueryParams, PaginatedResponse, Stock } from '@/api/types';
export interface UseStocksOptions {
    initialParams?: QueryParams;
    refetchInterval?: number;
}
export interface UseStocksResult<T extends Stock> {
    data: T[];
    pagination: PaginatedResponse<T>['pagination'] | null;
    loading: boolean;
    error: Error | null;
    lastUpdated: Date | null;
    refetch: () => Promise<void>;
    setParams: (params: QueryParams) => void;
}
export declare const useLowestPEStocks: (options?: UseStocksOptions) => UseStocksResult<any>;
export declare const useLargestDeclinesStocks: (options?: UseStocksOptions) => UseStocksResult<any>;
