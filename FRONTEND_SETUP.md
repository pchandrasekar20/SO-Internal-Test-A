# Frontend Setup Guide

This document explains how to set up and run the Stock Analysis Dashboard frontend.

## Prerequisites

- Node.js 18+ and npm
- The backend API running on `http://localhost:3000`

## Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install
```

Or from the project root:

```bash
npm run install-frontend
```

### 2. Start Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Backend Configuration

The frontend expects the backend API at `http://localhost:3000`. This is configured in `frontend/vite.config.ts`:

```typescript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

To change the API URL, set the environment variable:

```bash
VITE_API_URL=http://your-api-server:3000 npm run dev
```

## Project Structure

```
frontend/
├── src/
│   ├── __tests__/              # Test files
│   ├── api/
│   │   ├── client.ts           # Axios HTTP client
│   │   ├── stocks.ts           # API endpoints
│   │   └── types.ts            # TypeScript types
│   ├── components/             # Reusable components
│   │   ├── Table.tsx           # Generic data table
│   │   ├── Pagination.tsx      # Pagination control
│   │   ├── SearchFilter.tsx    # Search and filter
│   │   └── LastUpdated.tsx     # Timestamp display
│   ├── hooks/
│   │   └── useStocks.ts        # Custom hooks
│   ├── pages/
│   │   ├── LowestPERatios.tsx  # P/E ratio view
│   │   └── LargestDeclines.tsx # Price decline view
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── vitest.config.ts            # Test configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server on :5173

# Build
npm run build           # Build for production

# Testing
npm test                # Run tests once
npm run test:ui         # Run tests with UI
npm run test:coverage   # Generate coverage report

# Code quality
npm run lint            # Run ESLint with auto-fix

# Production
npm run preview         # Preview production build
```

## Key Features

### 1. Two Main Views
- **Lowest P/E Ratios**: Find potentially undervalued stocks
- **Largest 2-Year Declines**: Identify stocks with significant price drops

### 2. Interactive Table
- Sortable columns (click header to sort)
- Customizable columns with rendering
- Loading and error states
- Empty state handling

### 3. Search & Filter
- Real-time search by symbol or company name
- Filter by sector
- Filter by industry
- Reset all filters

### 4. Pagination
- Configurable page size (10, 25, 50, 100)
- Previous/Next navigation
- Item range display

### 5. Real-time Updates
- Auto-refresh every 60 seconds
- Manual refresh button
- Last updated timestamp
- Loading indicator

### 6. Responsive Design
- Mobile-first approach
- Tablet and desktop layouts
- Touch-friendly controls
- Horizontal scrolling for tables on small screens

### 7. Accessibility
- ARIA labels
- Semantic HTML
- Keyboard navigation
- Screen reader support

## API Integration

The frontend uses Axios to communicate with the backend:

### Endpoints

```typescript
// Get lowest P/E stocks
GET /api/stocks/low-pe?page=1&limit=25&sortBy=peRatio&sortOrder=asc

// Get stocks with largest declines
GET /api/stocks/largest-declines?page=1&limit=25&sortBy=priceChange&sortOrder=asc

// Health check
GET /health
```

### Response Format

```json
{
  "data": [
    {
      "id": "stock-1",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "sector": "Technology",
      "industry": "Consumer Electronics",
      "peRatio": 25.5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 500,
    "totalPages": 20
  }
}
```

## Custom Hooks

### useLowestPEStocks

Fetches and manages lowest P/E ratio stocks with automatic polling:

```typescript
const { data, pagination, loading, error, lastUpdated, refetch, setParams } =
  useLowestPEStocks({
    initialParams: { page: 1, limit: 25 },
    refetchInterval: 60000, // Auto-refresh every 60 seconds
  })
```

### useLargestDeclinesStocks

Similar to `useLowestPEStocks` but for price decline data.

## Component Props

### Table

```typescript
<Table
  columns={[{ key: 'symbol', label: 'Symbol', sortable: true }]}
  data={stocks}
  loading={loading}
  error={error}
  onSort={(sortBy, sortOrder) => {}}
  keyExtractor={(item) => item.id}
/>
```

### Pagination

```typescript
<Pagination
  page={1}
  totalPages={10}
  limit={25}
  total={250}
  onPageChange={(page) => {}}
  onLimitChange={(limit) => {}}
/>
```

### SearchFilter

```typescript
<SearchFilter
  onSearch={(term) => {}}
  onFilterChange={(filters) => {}}
  sectors={['Technology', 'Finance']}
  industries={['Software', 'Banking']}
/>
```

### LastUpdated

```typescript
<LastUpdated
  timestamp={new Date()}
  loading={false}
  onRefresh={() => {}}
/>
```

## Testing

The project uses Vitest and React Testing Library:

### Run Tests

```bash
npm test                # Run once
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
npm run test:ui        # Interactive UI
```

### Test Files

- `src/__tests__/Table.test.tsx` - Table component tests
- `src/__tests__/Pagination.test.tsx` - Pagination tests
- `src/__tests__/SearchFilter.test.tsx` - Search filter tests
- `src/__tests__/LastUpdated.test.tsx` - Last updated tests

### Example Test

```typescript
it('renders table with data', () => {
  render(
    <Table columns={columns} data={mockData} />
  )
  expect(screen.getByText('Item 1')).toBeInTheDocument()
})
```

## Styling with Tailwind CSS

The project uses Tailwind CSS for styling:

```typescript
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  <h1 className="text-xl font-bold text-blue-900">Title</h1>
</div>
```

Custom colors are defined in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'primary': '#3b82f6',
      'primary-dark': '#1e40af',
    },
  },
}
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Troubleshooting

### API Connection Issues

If the frontend can't connect to the backend:

1. Ensure the backend is running on `http://localhost:3000`
2. Check the `VITE_API_URL` environment variable
3. Verify CORS is enabled on the backend (it is by default)

### TypeScript Errors

```bash
npm install  # Reinstall dependencies
npm run build  # Check for build errors
```

### Test Failures

```bash
npm run test:ui  # Use interactive test runner
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Tips

- Use React DevTools to profile components
- Monitor bundle size: `npm run build`
- Check network requests in Browser DevTools
- Test on real devices

## Contributing

1. Follow the code style (ESLint will enforce)
2. Add tests for new components
3. Update documentation
4. Test on mobile devices

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev)
- [Vitest Docs](https://vitest.dev)

## Support

For issues or questions, check:
1. This guide
2. Frontend/README.md
3. Project-level README.md
4. Backend documentation
