'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Wallet, DollarSign, ShoppingCart, Zap } from 'lucide-react'
import { useListWallets } from '@/queries/user/wallet/wallets'
import { useListTransactions, useQuickStats, useTransactionChartData } from '@/queries/user/transaction/transaction'

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

const bgAccentMap = {
  blue: 'bg-blue-500',
  green: 'bg-success',
  orange: 'bg-warning',
  purple: 'bg-purple-500',
}

type PeriodType = 'today' | 'week' | 'month' | 'year' | 'all'

interface FinancialCardsProps {
  period?: PeriodType
}

export function FinancialCards({ period = 'month' }: FinancialCardsProps) {
  const { data: walletResponse, isLoading: walletsLoading } = useListWallets()
  const { data: quickStatsResponse, isLoading: quickStatsLoading } = useQuickStats({ period })
  const { data: chartDataResponse, isLoading: chartDataLoading } = useTransactionChartData({ period, walletId: undefined })
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

    // Extract data from quick stats
    const stats = quickStatsResponse?.data?.stats || {}
    const spentToday = quickStatsResponse?.data?.spentToday || {}
    const income = Number(stats.income || 0)
    const expenses = Number(stats.expenses || 0)
    const totalSpent = Number(spentToday.totalSpent || 0)
    const transactionCount = Number(stats.transactions || 0)

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
        title: 'Spent Today',
        amount: `₱${totalSpent.toFixed(2)}`,
        change: 8.2,
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'green',
        isLoading: quickStatsLoading,
      },
      {
        title: 'Expenses',
        amount: `₱${expenses.toFixed(2)}`,
        change: -4.3,
        icon: <ShoppingCart className="w-6 h-6" />,
        color: 'orange',
        isLoading: quickStatsLoading,
      },
      {
        title: 'Transactions',
        amount: `${transactionCount}`,
        change: 23.1,
        icon: <Zap className="w-6 h-6" />,
        color: 'purple',
        isLoading: quickStatsLoading,
      },
    ]
  }, [walletResponse, quickStatsResponse, walletsLoading, quickStatsLoading])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const isPositive = card.change >= 0
        return (
          <div
            key={index}
            className="bg-gradient-to-br from-card to-secondary border border-border rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group relative overflow-hidden"
          >
            {/* Background accent */}
            <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 blur-3xl ${bgAccentMap[card.color]}`} />
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
