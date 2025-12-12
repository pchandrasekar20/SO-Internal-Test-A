import { useState } from 'react'
import { LowestPERatios } from '@/pages/LowestPERatios'
import { LargestDeclines } from '@/pages/LargestDeclines'

type Tab = 'lowest-pe' | 'largest-declines'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('lowest-pe')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                📈 Stock Analysis Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time stock analysis with P/E ratios and 2-year price trends
              </p>
            </div>
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Data
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Main navigation">
            <button
              onClick={() => setActiveTab('lowest-pe')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'lowest-pe'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === 'lowest-pe' ? 'page' : undefined}
            >
              💎 Lowest P/E Ratios
            </button>
            <button
              onClick={() => setActiveTab('largest-declines')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'largest-declines'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={
                activeTab === 'largest-declines' ? 'page' : undefined
              }
            >
              📉 Largest 2-Year Declines
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {activeTab === 'lowest-pe' && <LowestPERatios />}
          {activeTab === 'largest-declines' && <LargestDeclines />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">About</h3>
              <p className="text-gray-400 text-sm">
                A comprehensive stock analysis dashboard providing real-time P/E
                ratios and 2-year price trend analysis.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Features</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>✓ Live P/E Ratio Analysis</li>
                <li>✓ 2-Year Price Trends</li>
                <li>✓ Advanced Filtering</li>
                <li>✓ Responsive Design</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Updates</h3>
              <p className="text-gray-400 text-sm">
                Data automatically refreshes every 60 seconds for the latest
                stock information.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Stock Analysis Dashboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
