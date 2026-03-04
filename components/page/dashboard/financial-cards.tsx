'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Wallet, DollarSign, ShoppingCart, Zap } from 'lucide-react'
import { useListWallets } from '@/queries/user/wallet/wallets'
import { useListTransactions } from '@/queries/user/transaction/transaction'

interface FinancialCard {
  title: string
  amount: string
  change: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'orange' | 'purple'
  isLoading?: boolean
}

const colorMap = {
  blue: 'bg-blue-500 dark:bg-blue-600',
  green: 'bg-success dark:bg-success',
  orange: 'bg-warning dark:bg-warning',
  purple: 'bg-purple-500 dark:bg-purple-600',
}

export function FinancialCards() {
  const { data: walletResponse, isLoading: walletsLoading } = useListWallets()
  const { data: transactionResponse, isLoading: transactionsLoading } = useListTransactions()

  const cards: FinancialCard[] = useMemo(() => {
    // Calculate total balance from wallets
    let totalBalance = 0
    const walletData = walletResponse?.data as any
    const wallets = Array.isArray(walletData)
      ? walletData
      : walletData?.items || walletData?.wallets || []

    if (Array.isArray(wallets)) {
      totalBalance = wallets.reduce((sum: number, w: any) => {
        const balance = Number(w.balance || w.currentBalance || 0)
        return w.status !== 'archived' ? sum + balance : sum
      }, 0)
    }

    // Calculate income and expenses from transactions
    let totalIncome = 0
    let totalExpense = 0
    const transactionData = transactionResponse?.data as any
    const transactions = Array.isArray(transactionData)
      ? transactionData
      : transactionData?.items || transactionData?.transactions || []

    if (Array.isArray(transactions)) {
      transactions.forEach((t: any) => {
        const amount = Number(t.amount || 0)
        if (t.type === 'income') {
          totalIncome += amount
        } else if (t.type === 'expense') {
          totalExpense += amount
        }
      })
    }

    return [
      {
        title: 'Total Balance',
        amount: `₱${totalBalance.toFixed(2)}`,
        change: 12.5,
        icon: <Wallet className="w-6 h-6" />,
        color: 'blue',
        isLoading: walletsLoading,
      },
      {
        title: 'Income',
        amount: `₱${totalIncome.toFixed(2)}`,
        change: 8.2,
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'green',
        isLoading: transactionsLoading,
      },
      {
        title: 'Expenses',
        amount: `₱${totalExpense.toFixed(2)}`,
        change: -4.3,
        icon: <ShoppingCart className="w-6 h-6" />,
        color: 'orange',
        isLoading: transactionsLoading,
      },
      {
        title: 'Investments',
        amount: `₱32,940.00`,
        change: 23.1,
        icon: <Zap className="w-6 h-6" />,
        color: 'purple',
        isLoading: false,
      },
    ]
  }, [walletResponse, transactionResponse, walletsLoading, transactionsLoading])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const isPositive = card.change >= 0
        return (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-4">
              <div className={`${colorMap[card.color]} p-3 rounded-lg text-white group-hover:shadow-lg transition-shadow`}>
                {card.icon}
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  isPositive
                    ? 'bg-success/20 text-success dark:bg-success/30 dark:text-success'
                    : 'bg-destructive/20 text-destructive dark:bg-destructive/30 dark:text-destructive'
                }`}
              >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{card.change}%
              </div>
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{card.title}</h3>

            {/* Amount */}
            {card.isLoading ? (
              <div className="h-8 bg-secondary rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{card.amount}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
