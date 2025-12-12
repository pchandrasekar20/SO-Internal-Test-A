import { useEffect, useState, useCallback } from 'react'
import { stocksApi } from '@/api/stocks'
import { QueryParams, PaginatedResponse, Stock } from '@/api/types'

export interface UseStocksOptions {
  initialParams?: QueryParams
  refetchInterval?: number
}

export interface UseStocksResult<T extends Stock> {
  data: T[]
  pagination: PaginatedResponse<T>['pagination'] | null
  loading: boolean
  error: Error | null
  lastUpdated: Date | null
  refetch: () => Promise<void>
  setParams: (params: QueryParams) => void
}

export const useLowestPEStocks = (
  options: UseStocksOptions = {}
): UseStocksResult<any> => {
  const { initialParams = {}, refetchInterval } = options
  const [data, setData] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [params, setParams] = useState<QueryParams>(initialParams)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await stocksApi.getLowestPEStocks(params)
      setData(result.data)
      setPagination(result.pagination)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!refetchInterval) return

    const interval = setInterval(fetchData, refetchInterval)
    return () => clearInterval(interval)
  }, [fetchData, refetchInterval])

  return {
    data,
    pagination,
    loading,
    error,
    lastUpdated,
    refetch: fetchData,
    setParams,
  }
}

export const useLargestDeclinesStocks = (
  options: UseStocksOptions = {}
): UseStocksResult<any> => {
  const { initialParams = {}, refetchInterval } = options
  const [data, setData] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [params, setParams] = useState<QueryParams>(initialParams)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await stocksApi.getLargestDeclinesStocks(params)
      setData(result.data)
      setPagination(result.pagination)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!refetchInterval) return

    const interval = setInterval(fetchData, refetchInterval)
    return () => clearInterval(interval)
  }, [fetchData, refetchInterval])

  return {
    data,
    pagination,
    loading,
    error,
    lastUpdated,
    refetch: fetchData,
    setParams,
  }
}
