import React, { useState } from 'react'

export interface SearchFilterProps {
  onSearch: (searchTerm: string) => void
  onFilterChange: (filters: FilterState) => void
  sectors?: string[]
  industries?: string[]
  placeholder?: string
}

export interface FilterState {
  sector?: string
  industry?: string
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilterChange,
  sectors = [],
  industries = [],
  placeholder = 'Search stocks...',
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sector, setSector] = useState('')
  const [industry, setIndustry] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    onSearch(term)
  }

  const handleFilterChange = () => {
    onFilterChange({
      sector: sector || undefined,
      industry: industry || undefined,
    })
  }

  const handleSectorChange = (value: string) => {
    setSector(value)
    onFilterChange({
      sector: value || undefined,
      industry,
    })
  }

  const handleIndustryChange = (value: string) => {
    setIndustry(value)
    onFilterChange({
      sector,
      industry: value || undefined,
    })
  }

  const handleReset = () => {
    setSearchTerm('')
    setSector('')
    setIndustry('')
    onSearch('')
    onFilterChange({})
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search stocks"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          aria-label="Toggle filters"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Hide' : 'Show'} Filters
        </button>

        {/* Reset Button */}
        {(searchTerm || sector || industry) && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            aria-label="Reset filters"
          >
            Reset
          </button>
        )}
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sectors.length > 0 && (
            <div>
              <label
                htmlFor="sector-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sector
              </label>
              <select
                id="sector-select"
                value={sector}
                onChange={(e) => handleSectorChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sectors</option>
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
          )}

          {industries.length > 0 && (
            <div>
              <label
                htmlFor="industry-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Industry
              </label>
              <select
                id="industry-select"
                value={industry}
                onChange={(e) => handleIndustryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="sm:col-span-2">
            <button
              onClick={handleFilterChange}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
