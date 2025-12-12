import React, { useState } from 'react'

export interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  className?: string
}

export interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  error?: Error | null
  onSort?: (sortBy: keyof T, sortOrder: 'asc' | 'desc') => void
  keyExtractor?: (item: T) => string
  className?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const Table = React.forwardRef<HTMLDivElement, TableProps<any>>(
  (
    {
      columns,
      data,
      loading = false,
      error = null,
      onSort,
      keyExtractor,
      className = '',
      sortBy,
      sortOrder,
    },
    ref
  ) => {
    const [internalSortBy, setInternalSortBy] = useState<string | null>(null)
    const [internalSortOrder, setInternalSortOrder] = useState<
      'asc' | 'desc'
    >('asc')

    const currentSortBy = sortBy || internalSortBy
    const currentSortOrder = sortOrder || internalSortOrder

    const handleSort = (columnKey: string) => {
      let newSortOrder: 'asc' | 'desc' = 'asc'

      if (currentSortBy === columnKey && currentSortOrder === 'asc') {
        newSortOrder = 'desc'
      }

      setInternalSortBy(columnKey)
      setInternalSortOrder(newSortOrder)

      if (onSort) {
        onSort(columnKey as any, newSortOrder)
      }
    }

    const getSortIcon = (columnKey: string) => {
      if (currentSortBy !== columnKey) {
        return <span className="ml-1 text-gray-400">⇅</span>
      }
      return currentSortOrder === 'asc' ? (
        <span className="ml-1 text-blue-600">↑</span>
      ) : (
        <span className="ml-1 text-blue-600">↓</span>
      )
    }

    if (error) {
      return (
        <div
          ref={ref}
          className={`p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 ${className}`}
          role="alert"
        >
          <h3 className="font-semibold">Error loading data</h3>
          <p className="text-sm">{error.message}</p>
        </div>
      )
    }

    return (
      <div ref={ref} className={`overflow-x-auto ${className}`}>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No data available
          </div>
        )}

        {!loading && data.length > 0 && (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    onClick={() =>
                      column.sortable && handleSort(String(column.key))
                    }
                    className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-200' : ''
                    } ${column.className || ''}`}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.sortable && getSortIcon(String(column.key))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={keyExtractor ? keyExtractor(item) : index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-4 py-3 text-sm text-gray-700 ${
                        column.className || ''
                      }`}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }
)

Table.displayName = 'Table'
