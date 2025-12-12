import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchFilter } from '@/components/SearchFilter'

describe('SearchFilter Component', () => {
  const mockProps = {
    onSearch: vi.fn(),
    onFilterChange: vi.fn(),
    sectors: ['Technology', 'Finance', 'Healthcare'],
    industries: ['Software', 'Banking', 'Pharmaceuticals'],
  }

  it('renders search input', () => {
    render(<SearchFilter {...mockProps} />)

    const searchInput = screen.getByPlaceholderText('Search stocks...')
    expect(searchInput).toBeInTheDocument()
  })

  it('calls onSearch when input changes', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()

    render(<SearchFilter {...mockProps} onSearch={onSearch} />)

    const searchInput = screen.getByPlaceholderText('Search stocks...')
    await user.type(searchInput, 'AAPL')

    expect(onSearch).toHaveBeenCalledWith('AAPL')
  })

  it('toggles filter visibility', async () => {
    const user = userEvent.setup()

    render(<SearchFilter {...mockProps} />)

    const toggleButton = screen.getByLabelText('Toggle filters')
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows filter selects when expanded', async () => {
    const user = userEvent.setup()

    render(<SearchFilter {...mockProps} />)

    const toggleButton = screen.getByLabelText('Toggle filters')
    await user.click(toggleButton)

    expect(screen.getByLabelText('Sector')).toBeInTheDocument()
    expect(screen.getByLabelText('Industry')).toBeInTheDocument()
  })

  it('calls onFilterChange when filters are changed', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()

    render(
      <SearchFilter {...mockProps} onFilterChange={onFilterChange} />
    )

    const toggleButton = screen.getByLabelText('Toggle filters')
    await user.click(toggleButton)

    const sectorSelect = screen.getByLabelText('Sector')
    await user.selectOptions(sectorSelect, 'Technology')

    expect(onFilterChange).toHaveBeenCalledWith({
      sector: 'Technology',
      industry: '',
    })
  })

  it('shows reset button when filters are active', async () => {
    const user = userEvent.setup()

    render(<SearchFilter {...mockProps} />)

    const searchInput = screen.getByPlaceholderText('Search stocks...')
    await user.type(searchInput, 'test')

    expect(screen.getByLabelText('Reset filters')).toBeInTheDocument()
  })

  it('resets all filters and search', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    const onFilterChange = vi.fn()

    render(
      <SearchFilter
        {...mockProps}
        onSearch={onSearch}
        onFilterChange={onFilterChange}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search stocks...')
    await user.type(searchInput, 'test')

    const resetButton = screen.getByLabelText('Reset filters')
    await user.click(resetButton)

    expect(onSearch).toHaveBeenCalledWith('')
    expect(onFilterChange).toHaveBeenCalledWith({})
  })
})
