'use client'

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
  onTransactionClick?: (id: string) => void
}

export function TransactionList({ transactions, isLoading, onTransactionClick }: TransactionListProps) {
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
    return `${prefix}$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
    <div className="space-y-2">
      {transactions.map((transaction) => (
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
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
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
  )
}
