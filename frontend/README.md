# Stock Analysis Dashboard Frontend

A modern, responsive React + TypeScript + Tailwind CSS frontend application for displaying stock analysis data including P/E ratios and 2-year price trends.

## 📋 Features

- **Responsive Design**: Mobile-first approach with full responsiveness
- **Two Main Views**:
  - Lowest P/E Ratio Stocks: Find undervalued stocks
  - Largest 2-Year Price Declines: Identify stocks with significant price drops
- **Advanced Filtering & Search**:
  - Real-time search by symbol or company name
  - Filter by sector and industry
  - Sortable columns
- **Pagination**: Configurable page sizes (10, 25, 50, 100 items)
- **Real-time Updates**: Auto-refresh every 60 seconds
- **Loading & Error States**: User-friendly feedback
- **Last Updated Timestamp**: Track data freshness
- **Manual Refresh**: On-demand data refresh button
- **Accessibility**: ARIA labels and semantic HTML
- **Unit Tests**: Comprehensive test coverage for critical components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Build

```bash
npm run build
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── __tests__/           # Unit tests and test setup
│   ├── api/                 # API client and types
│   │   ├── client.ts        # Axios instance
│   │   ├── types.ts         # TypeScript interfaces
│   │   └── stocks.ts        # Stock API endpoints
│   ├── components/          # Reusable components
│   │   ├── Table.tsx        # Generic table component
│   │   ├── Pagination.tsx   # Pagination controls
│   │   ├── SearchFilter.tsx # Search and filter controls
│   │   └── LastUpdated.tsx  # Last updated timestamp
│   ├── hooks/               # Custom React hooks
│   │   └── useStocks.ts     # Stock data fetching and polling
│   ├── pages/               # Page components
│   │   ├── LowestPERatios.tsx
│   │   └── LargestDeclines.tsx
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles with Tailwind
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration
├── tailwind.config.js       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
├── eslintrc.cjs             # ESLint config
└── package.json             # Dependencies and scripts
```

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:3000` (configurable via `VITE_API_URL`).

### Endpoints Used
- `GET /api/stocks/low-pe` - Fetch lowest P/E ratio stocks
- `GET /api/stocks/largest-declines` - Fetch stocks with largest declines
- `GET /health` - Health check endpoint

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 25, max: 100)
- `sortBy`: Sort field (e.g., 'peRatio', 'symbol', 'name', 'priceChange')
- `sortOrder`: Sort order ('asc' or 'desc')
- `sector`: Filter by sector
- `industry`: Filter by industry

## 🎨 Tailwind CSS

Custom Tailwind configuration with:
- Custom primary colors
- Responsive grid system
- Mobile-first utilities

## ♿ Accessibility

- ARIA labels on all interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color scheme

## 🧪 Testing

Uses Vitest and React Testing Library for unit tests:
- Component rendering tests
- User interaction tests
- Loading and error state tests
- Filter and sort functionality

## 🔄 Real-time Refresh

The application includes:
- **Auto-refresh**: Updates data every 60 seconds
- **Manual refresh**: Refresh button on each view
- **Last Updated**: Shows timestamp of last data fetch

## 📦 Dependencies

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing
- **ESLint**: Code linting

## 🚨 Error Handling

- Network error handling with user-friendly messages
- Loading states during data fetching
- Empty state when no data available
- Error boundary patterns

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints for sm, md, lg screens
- Touch-friendly controls
- Horizontal scroll for tables on small screens

## 🔐 Environment Variables

Create a `.env` file (optional):

```env
VITE_API_URL=http://localhost:3000
```

## 📝 Code Style

- Functional components with hooks
- TypeScript strict mode
- ESLint with React plugin
- Self-documenting code (minimal comments)
- Path aliases (@/ for src/)

## 🐛 Known Limitations

- Local search only (client-side filtering)
- Mock WebSocket stub (for future real-time updates)
- No authentication/authorization implemented

## 🔮 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] User preferences/settings
- [ ] Export data to CSV/Excel
- [ ] Advanced charting/visualizations
- [ ] User authentication
- [ ] Saved watchlists
- [ ] Historical price charts
- [ ] Email alerts

## 📄 License

MIT
