import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '@/components/Pagination'

describe('Pagination Component', () => {
  const defaultProps = {
    page: 2,
    totalPages: 5,
    limit: 25,
    total: 125,
    onPageChange: vi.fn(),
    onLimitChange: vi.fn(),
  }

  it('renders pagination info', () => {
    render(<Pagination {...defaultProps} />)

    expect(screen.getByText('Showing 26 to 50 of 125 results')).toBeInTheDocument()
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    const props = { ...defaultProps, page: 1 }
    render(<Pagination {...props} />)

    const prevButton = screen.getByLabelText('Previous page')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    const props = { ...defaultProps, page: 5 }
    render(<Pagination {...props} />)

    const nextButton = screen.getByLabelText('Next page')
    expect(nextButton).toBeDisabled()
  })

  it('calls onPageChange when next button is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    const props = { ...defaultProps, onPageChange }

    render(<Pagination {...props} />)

    const nextButton = screen.getByLabelText('Next page')
    await user.click(nextButton)

    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange when previous button is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    const props = { ...defaultProps, onPageChange }

    render(<Pagination {...props} />)

    const prevButton = screen.getByLabelText('Previous page')
    await user.click(prevButton)

    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('calls onLimitChange when limit select changes', async () => {
    const user = userEvent.setup()
    const onLimitChange = vi.fn()
    const props = { ...defaultProps, onLimitChange }

    render(<Pagination {...props} />)

    const limitSelect = screen.getByDisplayValue('25')
    await user.selectOptions(limitSelect, '50')

    expect(onLimitChange).toHaveBeenCalledWith(50)
  })

  it('shows correct item range for different pages', () => {
    const { rerender } = render(<Pagination {...defaultProps} />)
    expect(screen.getByText('Showing 26 to 50 of 125 results')).toBeInTheDocument()

    rerender(<Pagination {...defaultProps} page={1} />)
    expect(screen.getByText('Showing 1 to 25 of 125 results')).toBeInTheDocument()

    rerender(<Pagination {...defaultProps} page={5} total={110} />)
    expect(screen.getByText('Showing 101 to 110 of 110 results')).toBeInTheDocument()
  })
})
