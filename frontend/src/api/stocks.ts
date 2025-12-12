import apiClient from './client'
import {
  StockWithPERatio,
  StockWithPriceChange,
  PaginatedResponse,
  QueryParams,
} from './types'

export const stocksApi = {
  getLowestPEStocks: async (
    params?: QueryParams
  ): Promise<PaginatedResponse<StockWithPERatio>> => {
    const response = await apiClient.get<PaginatedResponse<StockWithPERatio>>(
      '/api/stocks/low-pe',
      { params }
    )
    return response.data
  },

  getLargestDeclinesStocks: async (
    params?: QueryParams
  ): Promise<PaginatedResponse<StockWithPriceChange>> => {
    const response = await apiClient.get<
      PaginatedResponse<StockWithPriceChange>
    >('/api/stocks/largest-declines', { params })
    return response.data
  },

  getHealth: async (): Promise<{ status: string }> => {
    const response = await apiClient.get<{ status: string }>('/health')
    return response.data
  },
}
