'use client'

import { useState } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import { Check } from 'lucide-react'
import { useTransactionTags } from '@/queries/user/transaction/transaction'
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
  wallets?: { id: string; name?: string }[]
}

export interface FilterState {
  type?: 'income' | 'expense' | 'transfer' | 'all'
  status?: 'completed' | 'pending' | 'cancelled' | 'all'
  search?: string
  dateRange?: 'today' | 'week' | 'month' | 'year' | 'all'
  walletId?: string
  tags?: string[]
}

export function TransactionFilters({ onFilterChange, wallets }: TransactionFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    status: 'all',
    dateRange: 'month',
    walletId: '',
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
      walletId: '',
      search: '',
      tags: [],
    })
    onFilterChange({
      type: 'all',
      status: 'all',
      dateRange: 'month',
      walletId: '',
      search: '',
      tags: [],
    })
  }

  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => value && value !== 'all' && value !== ''
  ).length

  // Fetch available tags
  const { data: tagsResponse } = useTransactionTags()
  // Normalize possible response shapes:
  // - ['tag1','tag2']
  // - { tags: [...] }
  // - { data: { tags: [...] } }
  let availableTags: string[] = []
  if (!tagsResponse) {
    availableTags = []
  } else if (Array.isArray(tagsResponse)) {
    availableTags = tagsResponse
  } else if (Array.isArray((tagsResponse as any).tags)) {
    availableTags = (tagsResponse as any).tags
  } else if (Array.isArray((tagsResponse as any).data)) {
    availableTags = (tagsResponse as any).data
  } else if (Array.isArray((tagsResponse as any).data?.tags)) {
    availableTags = (tagsResponse as any).data.tags
  }

  const toggleTag = (tag: string) => {
    const current = filters.tags || []
    const exists = current.includes(tag)
    const updated = exists ? current.filter((t) => t !== tag) : [...current, tag]
    handleFilterChange({ tags: updated })
  }

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
        {/* Wallet Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {filters.walletId && filters.walletId !== ''
                ? `Wallet (${wallets?.find((w) => w.id === filters.walletId)?.name || filters.walletId})`
                : 'All Wallets'}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Wallet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleFilterChange({ walletId: '' })}>
              All Wallets
            </DropdownMenuItem>
            {wallets?.map((w) => (
              <DropdownMenuItem key={w.id} onClick={() => handleFilterChange({ walletId: w.id })}>
                {w.name || w.id}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
        {/* Tags Filter */}
        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 w-full justify-between">
                {filters.tags && filters.tags.length > 0 ? `Tags (${filters.tags.length})` : 'Tags'}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Transaction Tags</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleFilterChange({ tags: [] })}>
                Clear Tags
              </DropdownMenuItem>
              {availableTags.map((t) => (
                <DropdownMenuItem key={t} onClick={() => toggleTag(t)}>
                  <div className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${filters.tags?.includes(t) ? 'opacity-100' : 'opacity-0'}`} />
                    <span>{t}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
