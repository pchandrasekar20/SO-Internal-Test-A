import React from 'react'

export interface PaginationProps {
  page: number
  totalPages: number
  limit: number
  total: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) => {
  const startItem = (page - 1) * limit + 1
  const endItem = Math.min(page * limit, total)

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1)
    }
  }

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {total} results
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm text-gray-600">
            Per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => {
              onLimitChange(parseInt(e.target.value))
              onPageChange(1)
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Items per page"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          aria-label="Previous page"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={page >= totalPages}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  )
}
