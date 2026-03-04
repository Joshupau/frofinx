'use client'

import { useState } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

interface TransactionFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  type?: 'income' | 'expense' | 'transfer' | 'all'
  status?: 'completed' | 'pending' | 'cancelled' | 'all'
  search?: string
  dateRange?: 'today' | 'week' | 'month' | 'year' | 'all'
}

export function TransactionFilters({ onFilterChange }: TransactionFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    status: 'all',
    dateRange: 'month',
    search: '',
  })

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  const handleReset = () => {
    setFilters({
      type: 'all',
      status: 'all',
      dateRange: 'month',
      search: '',
    })
    onFilterChange({
      type: 'all',
      status: 'all',
      dateRange: 'month',
      search: '',
    })
  }

  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => value && value !== 'all' && value !== ''
  ).length

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary transition-all">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
          className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
        />
        {filters.search && (
          <button
            onClick={() => handleFilterChange({ search: '' })}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Type {filters.type && filters.type !== 'all' && `(${filters.type})`}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Transaction Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterChange({ type: 'all' })}>
              All Transactions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange({ type: 'income' })}>
              Income
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange({ type: 'expense' })}>
              Expense
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange({ type: 'transfer' })}>
              Transfer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Status {filters.status && filters.status !== 'all' && `(${filters.status})`}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Transaction Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterChange({ status: 'all' })}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange({ status: 'completed' })}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange({ status: 'pending' })}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange({ status: 'cancelled' })}>
              Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Range Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {filters.dateRange && (filters.dateRange === 'all' ? 'All Time' : filters.dateRange?.charAt(0).toUpperCase() + filters.dateRange?.slice(1))}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Date Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterChange({ dateRange: 'today' })}>
              Today
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange({ dateRange: 'week' })}>
              This Week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange({ dateRange: 'month' })}>
              This Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange({ dateRange: 'year' })}>
              This Year
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange({ dateRange: 'all' })}>
              All Time
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset Button */}
        {activeFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
