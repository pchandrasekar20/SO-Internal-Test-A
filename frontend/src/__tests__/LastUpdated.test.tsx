import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LastUpdated } from '@/components/LastUpdated'

describe('LastUpdated Component', () => {
  it('displays "Never" when no timestamp', () => {
    render(<LastUpdated timestamp={null} />)

    expect(screen.getByText('Never')).toBeInTheDocument()
  })

  it('displays formatted timestamp', () => {
    const date = new Date('2024-01-15T10:30:45')
    render(<LastUpdated timestamp={date} />)

    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument()
  })

  it('shows refresh button when onRefresh is provided', () => {
    render(
      <LastUpdated
        timestamp={null}
        onRefresh={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Refresh data')).toBeInTheDocument()
  })

  it('calls onRefresh when button is clicked', async () => {
    const user = userEvent.setup()
    const onRefresh = vi.fn()

    render(
      <LastUpdated
        timestamp={null}
        onRefresh={onRefresh}
      />
    )

    const refreshButton = screen.getByLabelText('Refresh data')
    await user.click(refreshButton)

    expect(onRefresh).toHaveBeenCalled()
  })

  it('disables refresh button when loading', () => {
    const onRefresh = vi.fn()

    render(
      <LastUpdated
        timestamp={null}
        loading={true}
        onRefresh={onRefresh}
      />
    )

    const refreshButton = screen.getByLabelText('Refresh data')
    expect(refreshButton).toBeDisabled()
    expect(screen.getByText('Refreshing...')).toBeInTheDocument()
  })

  it('renders without refresh button when no onRefresh callback', () => {
    render(
      <LastUpdated
        timestamp={new Date()}
      />
    )

    expect(screen.queryByLabelText('Refresh data')).not.toBeInTheDocument()
  })
})
