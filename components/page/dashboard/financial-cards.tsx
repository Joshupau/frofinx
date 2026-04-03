'use client'

import { useMemo, useState } from 'react'
import { TrendingUp, TrendingDown, Wallet, ShoppingCart, Zap, Eye, EyeOff } from 'lucide-react'
import { useListWallets } from '@/queries/user/wallet/wallets'
import { useQuickStats } from '@/queries/user/transaction/transaction'
import { useSettingsStore } from '@/store/settings-store'
import { formatMoney } from '@/utils/formatter'

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
  const { currency, hideAmountsOnOpen } = useSettingsStore()
  const [visibleAmounts, setVisibleAmounts] = useState<Record<string, boolean>>({})

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
    const expenses = Number(stats.expenses || 0)
    const totalSpent = Number(spentToday.totalSpent || 0)
    const transactionCount = Number(stats.transactions || 0)

    return [
      {
        title: 'Total Balance',
        amount: formatMoney(totalBalance, currency),
        change: 12.5,
        icon: <Wallet className="w-6 h-6" />,
        color: 'blue',
        isLoading: walletsLoading,
      },
      {
        title: 'Spent Today',
        amount: formatMoney(totalSpent, currency),
        change: 8.2,
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'green',
        isLoading: quickStatsLoading,
      },
      {
        title: 'Expenses',
        amount: formatMoney(expenses, currency),
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
  }, [walletResponse, quickStatsResponse, walletsLoading, quickStatsLoading, currency])

  const toggleAmountVisibility = (title: string) => {
    setVisibleAmounts((current) => ({
      ...current,
      [title]: !current[title],
    }))
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
      {cards.map((card, index) => {
        const isPositive = card.change >= 0
        const showAmount = visibleAmounts[card.title] ?? !hideAmountsOnOpen
        return (
          <div
            key={index}
            className="bg-gradient-to-br from-card to-secondary border border-border rounded-xl p-3 sm:p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group relative overflow-hidden min-w-0"
          >
            {/* Background accent */}
            <div className={`pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 blur-3xl ${bgAccentMap[card.color]}`} />
            {/* Header with Icon */}
            <div className="relative z-10 flex items-start justify-between mb-3 sm:mb-4 gap-2">
              <div className={`${colorMap[card.color]} p-2 sm:p-3 rounded-lg text-white group-hover:shadow-lg transition-shadow shrink-0`}>
                {card.icon}
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
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
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 leading-tight">{card.title}</h3>

            {/* Amount */}
            {card.isLoading ? (
              <div className="relative z-10 h-8 bg-secondary rounded animate-pulse" />
            ) : (
              <div className="relative z-10 flex items-center justify-between gap-2">
                <p className="text-lg sm:text-2xl font-bold text-foreground truncate pr-2">{showAmount ? card.amount : '••••••'}</p>
                <button
                  onClick={() => toggleAmountVisibility(card.title)}
                  className="pointer-events-auto relative z-10 p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground shrink-0 touch-manipulation"
                  aria-label={showAmount ? `Hide ${card.title} amount` : `Show ${card.title} amount`}
                >
                  {showAmount ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
