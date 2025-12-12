import React, { useState } from 'react'
import { useLargestDeclinesStocks } from '@/hooks/useStocks'
import { Table, Column } from '@/components/Table'
import { Pagination } from '@/components/Pagination'
import { SearchFilter, FilterState } from '@/components/SearchFilter'
import { LastUpdated } from '@/components/LastUpdated'
import { StockWithPriceChange, QueryParams } from '@/api/types'

export const LargestDeclines: React.FC = () => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    limit: 25,
    sortBy: 'priceChange',
    sortOrder: 'asc',
  })

  const { data, pagination, loading, error, lastUpdated, refetch, setParams } =
    useLargestDeclinesStocks({
      initialParams: queryParams,
      refetchInterval: 60000, // Auto-refresh every 60 seconds
    })

  const handleSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    const newParams = { ...queryParams, sortBy, sortOrder, page: 1 }
    setQueryParams(newParams)
    setParams(newParams)
  }

  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, page }
    setQueryParams(newParams)
    setParams(newParams)
  }

  const handleLimitChange = (limit: number) => {
    const newParams = { ...queryParams, limit, page: 1 }
    setQueryParams(newParams)
    setParams(newParams)
  }

  const handleFilterChange = (filters: FilterState) => {
    const newParams = {
      ...queryParams,
      sector: filters.sector,
      industry: filters.industry,
      page: 1,
    }
    setQueryParams(newParams)
    setParams(newParams)
  }

  const columns: Column<StockWithPriceChange>[] = [
    {
      key: 'symbol',
      label: 'Symbol',
      sortable: true,
      render: (value) => <span className="font-semibold text-blue-600">{value}</span>,
      className: 'w-20',
    },
    {
      key: 'name',
      label: 'Company Name',
      sortable: true,
      className: 'min-w-48',
    },
    {
      key: 'sector',
      label: 'Sector',
      sortable: false,
      render: (value) => value || '-',
    },
    {
      key: 'industry',
      label: 'Industry',
      sortable: false,
      render: (value) => value || '-',
    },
    {
      key: 'priceChange',
      label: '2-Year Price Change (%)',
      sortable: true,
      render: (value) => {
        const isNegative = typeof value === 'number' && value < 0
        return (
          <span
            className={`font-semibold ${
              isNegative ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {typeof value === 'number' ? value.toFixed(2) : 'N/A'}%
          </span>
        )
      },
      className: 'text-right',
    },
  ]

  const [searchTerm, setSearchTerm] = useState('')
  const filteredData = searchTerm
    ? data.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Largest 2-Year Price Declines
        </h1>
        <p className="text-gray-600">
          Stocks with the largest negative price changes over the past 2 years.
          Negative values indicate price declines.
        </p>
      </div>

      <LastUpdated timestamp={lastUpdated} loading={loading} onRefresh={refetch} />

      <SearchFilter
        onSearch={(term) => setSearchTerm(term)}
        onFilterChange={handleFilterChange}
        placeholder="Search by symbol or company name..."
      />

      <div className="mt-6">
        <Table<StockWithPriceChange>
          columns={columns}
          data={filteredData}
          loading={loading}
          error={error}
          onSort={handleSort}
          keyExtractor={(stock) => stock.id}
          sortBy={queryParams.sortBy as string}
          sortOrder={queryParams.sortOrder}
        />
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          total={pagination.total}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  )
}
