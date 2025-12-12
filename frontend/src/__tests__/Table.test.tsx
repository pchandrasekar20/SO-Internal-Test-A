import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Table, Column } from '@/components/Table'

interface TestItem {
  id: string
  name: string
  value: number
}

const mockData: TestItem[] = [
  { id: '1', name: 'Item 1', value: 100 },
  { id: '2', name: 'Item 2', value: 200 },
  { id: '3', name: 'Item 3', value: 300 },
]

const mockColumns: Column<TestItem>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'value', label: 'Value', sortable: true },
]

describe('Table Component', () => {
  it('renders table with data', () => {
    render(
      <Table<TestItem>
        columns={mockColumns}
        data={mockData}
        keyExtractor={(item) => item.id}
      />
    )

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(
      <Table<TestItem>
        columns={mockColumns}
        data={[]}
        loading={true}
      />
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    const error = new Error('Test error message')
    render(
      <Table<TestItem>
        columns={mockColumns}
        data={[]}
        error={error}
      />
    )

    expect(screen.getByText('Error loading data')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(
      <Table<TestItem>
        columns={mockColumns}
        data={[]}
        loading={false}
      />
    )

    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('calls onSort when sortable column header is clicked', async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()

    render(
      <Table<TestItem>
        columns={mockColumns}
        data={mockData}
        onSort={onSort}
        keyExtractor={(item) => item.id}
      />
    )

    const nameHeader = screen.getByText('Name')
    await user.click(nameHeader)

    expect(onSort).toHaveBeenCalledWith('name', 'asc')
  })

  it('renders custom cell content with render function', () => {
    const columnsWithRender: Column<TestItem>[] = [
      {
        key: 'name',
        label: 'Name',
        render: (value) => <span>{value.toUpperCase()}</span>,
      },
      { key: 'value', label: 'Value' },
    ]

    render(
      <Table<TestItem>
        columns={columnsWithRender}
        data={mockData}
        keyExtractor={(item) => item.id}
      />
    )

    expect(screen.getByText('ITEM 1')).toBeInTheDocument()
    expect(screen.getByText('ITEM 2')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Table<TestItem>
        columns={mockColumns}
        data={mockData}
        className="custom-class"
        keyExtractor={(item) => item.id}
      />
    )

    const tableContainer = container.firstChild
    expect(tableContainer).toHaveClass('custom-class')
  })
})
