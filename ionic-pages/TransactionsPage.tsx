'use client'

import { useState, useMemo, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Plus, Download, Filter, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { IonContent, IonPage } from '@ionic/react'
import { DashboardHeader } from '@/components/page/dashboard/dashboard-header'
import { TransactionStats } from '@/components/page/transaction/transaction-stats'
import { FilterState, TransactionFilters } from '@/components/page/transaction/transaction-filter'
import { TransactionList } from '@/components/page/transaction/transaction-list'
import { useListTransactions, useTransactionsSummary } from '@/queries/user/transaction/transaction'
import { useListWallets } from '@/queries/user/wallet/wallets'
import { ListTransactionsParams } from '@/types/transaction'
import { CreateTransactionModal } from '@/components/page/transaction/create-transaction-modal'
import { TransactionImportModal } from '@/components/page/transaction/transaction-import-modal'

// Helper function to convert filter state to API params
const convertFilterToParams = (filters: FilterState): ListTransactionsParams => {
  const params: ListTransactionsParams = {}

  if (filters.type && filters.type !== 'all') {
    params.type = filters.type
  }

  if (filters.status && filters.status !== 'all') {
    params.status = filters.status
  }

  if (filters.search) {
    params.search = filters.search
  }

  // Convert dateRange to startDate/endDate
  if (filters.dateRange && filters.dateRange !== 'all') {
    const today = new Date()
    let startDate = new Date()
    let endDate = new Date()
    // startDate is start of the month and endDate is end of the month by default
    startDate.setDate(1)
    endDate.setMonth(endDate.getMonth() + 1)
    endDate.setDate(0)

    switch (filters.dateRange) {
      case 'today':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        break
      case 'week':
        startDate.setDate(today.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(today.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1)
        break
    }

    params.startDate = startDate.toISOString().split('T')[0]
    params.endDate = endDate.toISOString().split('T')[0]
  }

  if (filters.walletId && filters.walletId !== '') {
    params.walletId = filters.walletId
  }

  if (filters.tags && filters.tags.length > 0) {
    params.tags = filters.tags
  }

  return params
}
export function TransactionsPage() {

  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    search: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [allTransactions, setAllTransactions] = useState<any[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const { data: walletsData, isLoading: walletsLoading } = useListWallets();
  const wallets = walletsData?.data
    ? Array.isArray(walletsData.data)
      ? walletsData.data
      : walletsData.data.items || []
    : []

  // Convert filters to API params
  const apiParams = {
    ...convertFilterToParams(filters),
    page: String(page), 
    limit: String(limit),
  };

  // Fetch transactions from API
  const { data: apiResponse, isLoading, error, refetch } = useListTransactions(apiParams);
  // Fetch summary stats
  const { data: summaryData, isLoading: summaryLoading } = useTransactionsSummary(apiParams);
  
  // Extract transactions and pagination info from API response
  const currentPageTransactions = useMemo(() => {
    if (!apiResponse?.data) return [];
    // Handle both array and paginated response formats
    return Array.isArray(apiResponse.data)
      ? apiResponse.data
      : apiResponse.data.items || [];
  }, [apiResponse]);

  const totalItems = apiResponse?.data?.totalItems || currentPageTransactions.length;
  const totalPagesCount = apiResponse?.data?.totalPages || 1;

  // Handle accumulating transactions for infinite scroll
  useEffect(() => {
    if (page === 0) {
      // Reset when filters change
      setAllTransactions(currentPageTransactions);
    } else {
      // Append new transactions
      setAllTransactions(prev => [...prev, ...currentPageTransactions]);
      setIsLoadingMore(false);
    }
  }, [currentPageTransactions, page]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(0);
    setAllTransactions([]);
    setIsLoadingMore(false);
  }, [filters]);

  const handleLoadMore = () => {
    if (!isLoadingMore && page + 1 < totalPagesCount) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  // Use summary stats from API
  const stats = {
    totalIncome: summaryData?.data?.totalIncome ?? 0,
    totalExpense: summaryData?.data?.totalExpenses ?? 0,
    totalTransfers: summaryData?.data?.totalTransfers ?? 0,
    transactionCount: summaryData?.data?.totalTransactions ?? 0,
  };

  return (
    <IonPage>
      <IonContent className="bg-background text-foreground">

        {/* Main Content */}
        <main>
          {/* Page Header */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-foreground">Transactions</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Track and analyze your financial movements</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Desktop / larger screens: show separate buttons */}
                  <div className="hidden sm:flex items-center gap-3">
                    <Button variant="outline" className="gap-2 flex-shrink-0" size="sm">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                    <Button variant="outline" className="gap-2 flex-shrink-0" size="sm" onClick={() => setShowImportModal(true)}>
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Import</span>
                    </Button>
                    <Button className="gap-2 flex-shrink-0" onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">New Transaction</span>
                    </Button>
                  </div>

                  {/* Mobile: condensed dropdown */}
                  <div className="sm:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="p-2">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => { /* TODO: implement export */ console.warn('Export not implemented') }}>
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowImportModal(true)}>
                          Import
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowCreateModal(true)}>
                          New Transaction
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <TransactionStats stats={stats} isLoading={isLoading} />
          </div>

          {/* Main Content Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-6">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                  <div className="space-y-4">
                  {/* Mobile Filter Toggle */}
                  <div className="lg:hidden">
                    <Button
                      variant="outline"
                      className="w-full gap-2 justify-center"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="w-4 h-4" />
                      {showFilters ? 'Hide' : 'Show'} Filters
                    </Button>
                  </div>

                  {/* Filters Card */}
                  <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-card border border-border rounded-lg p-6`}>
                    <h2 className="text-lg font-semibold text-foreground mb-6">Filters</h2>
                    <TransactionFilters onFilterChange={setFilters} wallets={wallets} />
                  </div>
                </div>
              </div>

              {/* Transaction List */}
              <div className="lg:col-span-3">
                <TransactionList
                  transactions={allTransactions}
                  isLoading={isLoading && page === 0}
                  hasMore={page + 1 < totalPagesCount}
                  isLoadingMore={isLoadingMore}
                  onTransactionClick={setSelectedTransaction}
                  onLoadMore={handleLoadMore}
                />
              </div>
            </div>
          </div>
        </main>
      </IonContent>

      {/* Import Transactions Modal */}
      <TransactionImportModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => refetch()}
      />

      {/* Create Transaction Modal */}
      <CreateTransactionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => refetch()}
      />
    </IonPage>
  )
}
