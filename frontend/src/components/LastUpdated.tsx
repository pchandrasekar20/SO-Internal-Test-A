import React from 'react'

export interface LastUpdatedProps {
  timestamp: Date | null
  loading?: boolean
  onRefresh?: () => void
}

export const LastUpdated: React.FC<LastUpdatedProps> = ({
  timestamp,
  loading = false,
  onRefresh,
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  return (
    <div className="flex items-center justify-between text-sm text-gray-600 mb-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide">
          Last Updated:
        </span>
        {timestamp ? (
          <span className="font-mono">{formatTime(timestamp)}</span>
        ) : (
          <span className="text-gray-400">Never</span>
        )}
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
          aria-label="Refresh data"
          title="Click to refresh data"
        >
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          {loading && <span className="animate-spin">⟳</span>}
        </button>
      )}
    </div>
  )
}
