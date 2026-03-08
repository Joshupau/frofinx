'use client'

import { useState, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Plus, Download, Filter } from 'lucide-react'
import { IonContent, IonPage } from '@ionic/react'
import { DashboardHeader } from '@/components/page/dashboard/dashboard-header'
import { TransactionStats } from '@/components/page/transaction/transaction-stats'
import { FilterState, TransactionFilters } from '@/components/page/transaction/transaction-filter'
import { TransactionList } from '@/components/page/transaction/transaction-list'
import { useListTransactions, useTransactionsSummary } from '@/queries/user/transaction/transaction'
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
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

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
  const transactions = useMemo(() => {
    if (!apiResponse?.data) return [];
    // Handle both array and paginated response formats
    return Array.isArray(apiResponse.data)
      ? apiResponse.data
      : apiResponse.data.items || [];
  }, [apiResponse]);

    const totalItems = apiResponse?.data?.totalItems || transactions.length;
  const totalPages = apiResponse?.data?.totalPages || 1;

  // Use summary stats from API
  const stats = {
    totalIncome: summaryData?.data?.totalIncome ?? 0,
    totalExpense: summaryData?.data?.totalExpenses ?? 0,
    totalTransfers: summaryData?.data?.totalTransfers ?? 0,
    transactionCount: summaryData?.data?.totalTransactions ?? 0,
  };

  return (
    <IonPage>
      <IonContent className="min-h-screen bg-background text-foreground">
        {/* Navbar */}

        {/* Main Content */}
        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-foreground">Transactions</h1>
                  <p className="text-muted-foreground mt-2">Track and analyze your financial movements</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2" size="sm">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <Button variant="outline" className="gap-2" size="sm" onClick={() => setShowImportModal(true)}>
                    <Download className="w-4 h-4" />
                    Import
                  </Button>
                  <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Transaction</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TransactionStats stats={stats} isLoading={isLoading} />
          </div>

          {/* Main Content Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 space-y-4">
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
                    <TransactionFilters onFilterChange={setFilters} />
                  </div>
                </div>
              </div>

              {/* Transaction List */}
              <div className="lg:col-span-3">
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-secondary/50">
                    <h2 className="font-semibold text-foreground">
                      {transactions.length} Transaction{transactions.length !== 1 ? 's' : ''}
                    </h2>
                  </div>
                  <TransactionList
                    transactions={transactions}
                    isLoading={isLoading}
                    onTransactionClick={setSelectedTransaction}
                  />
                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/50">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 0}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page + 1 >= totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
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
