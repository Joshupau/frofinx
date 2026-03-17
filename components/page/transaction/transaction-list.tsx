'use client'

import { useEffect, useRef } from 'react'
import { ArrowUpRight, ArrowDownLeft, Shuffle, Clock, Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface TransactionItem {
  id: string
  title: string
  description: string
  date: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  status: 'completed' | 'pending' | 'cancelled'
  category?: string
}

interface TransactionListProps {
  transactions: TransactionItem[]
  isLoading?: boolean
  hasMore?: boolean
  isLoadingMore?: boolean
  onTransactionClick?: (id: string) => void
  onLoadMore?: () => void
}

export function TransactionList({ transactions, isLoading, hasMore = false, isLoadingMore = false, onTransactionClick, onLoadMore }: TransactionListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Setup IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!onLoadMore || isLoadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentSentinel = sentinelRef.current
    if (currentSentinel) {
      observer.observe(currentSentinel)
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel)
      }
    }
  }, [hasMore, isLoadingMore, onLoadMore])
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="w-5 h-5 text-success" />
      case 'expense':
        return <ArrowDownLeft className="w-5 h-5 text-destructive" />
      case 'transfer':
        return <Shuffle className="w-5 h-5 text-accent" />
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-success" />
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />
      case 'cancelled':
        return <X className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-success/10 text-success hover:bg-success/20',
      pending: 'bg-warning/10 text-warning hover:bg-warning/20',
      cancelled: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
    }
    return variants[status as keyof typeof variants] || ''
  }

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : ''
    return `${prefix}₱${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const calculateDayTotals = (dayTransactions: TransactionItem[]) => {
    let income = 0
    let expense = 0
    
    dayTransactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        income += transaction.amount
      } else if (transaction.type === 'expense') {
        expense += transaction.amount
      }
    })
    
    return { income, expense, net: income - expense }
  }

  const groupTransactionsByDay = (txns: TransactionItem[]) => {
    const grouped: { [key: string]: TransactionItem[] } = {}
    const dateMetadata: { [key: string]: string } = {}
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    txns.forEach((transaction) => {
      const transactionDate = new Date(transaction.date)
      const dateKey = transactionDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      
      const transactionDateNormalized = new Date(transactionDate)
      transactionDateNormalized.setHours(0, 0, 0, 0)
      
      const isToday = transactionDateNormalized.getTime() === today.getTime()
      const displayLabel = isToday ? 'Today' : dateKey
      
      if (!dateMetadata[dateKey]) {
        dateMetadata[dateKey] = displayLabel
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(transaction)
    })

    // Sort by date (newest first)
    const sorted = Object.entries(grouped).sort((a, b) => {
      return new Date(b[0]).getTime() - new Date(a[0]).getTime()
    })
    
    return sorted.map(([dateKey, transactions]) => ({
      dateKey,
      displayLabel: dateMetadata[dateKey],
      transactions
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-secondary rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">No transactions found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new transaction</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {groupTransactionsByDay(transactions).map(({ dateKey, displayLabel, transactions: dayTransactions }) => (
          <div key={dateKey}>
            {/* Day Header */}
            <h3 className="text-sm font-semibold text-muted-foreground px-2 mb-2">{displayLabel}</h3>
            
            {/* Transactions for this day */}
            <div className="space-y-2">
              {dayTransactions.map((transaction) => (
                <button
                  key={transaction.id}
                  onClick={() => onTransactionClick?.(transaction.id)}
                  className="w-full bg-card border border-border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    {/* Left - Icon & Details */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                        {getIcon(transaction.type)}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">{transaction.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{transaction.description}</p>
                      </div>
                    </div>

                    {/* Right - Amount & Status */}
                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === 'income' ? 'text-success' : 
                          transaction.type === 'expense' ? 'text-destructive' : 
                          'text-foreground'
                        }`}>
                          {formatAmount(transaction.amount, transaction.type)}
                        </p>
                      </div>

                      <Badge className={`flex items-center gap-1 flex-shrink-0 ${getStatusBadge(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="hidden sm:inline capitalize text-xs">{transaction.status}</span>
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Day Total */}
            {(() => {
              const { income, expense } = calculateDayTotals(dayTransactions)
              return (
                <div className="flex justify-end gap-6 px-2 mt-3 text-sm font-semibold">
                  <div className="text-right">
                    <p className="text-success text-sm">+₱{income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-destructive text-sm">-₱{expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              )
            })()}
          </div>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}
    </>
  )
}
