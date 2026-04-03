'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Shuffle, MoreHorizontal, Eye, EyeOff } from 'lucide-react'
import { useSettingsStore } from '@/store/settings-store'
import { formatMoney } from '@/utils/formatter'

interface TransactionStats {
  totalIncome: number
  totalExpense: number
  totalTransfers: number
  transactionCount: number
}

interface TransactionStatsProps {
  stats: TransactionStats
  isLoading?: boolean
}

export function TransactionStats({ stats, isLoading }: TransactionStatsProps) {
  const { currency, hideAmountsOnOpen } = useSettingsStore()
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setVisibleCards({
      totalIncome: !hideAmountsOnOpen,
      totalExpense: !hideAmountsOnOpen,
      totalTransfers: !hideAmountsOnOpen,
    })
  }, [hideAmountsOnOpen])

  const statCards = [
    {
      key: 'totalIncome',
      label: 'Total Income',
      value: stats.totalIncome,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      key: 'totalExpense',
      label: 'Total Expenses',
      value: stats.totalExpense,
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      key: 'totalTransfers',
      label: 'Transfers',
      value: stats.totalTransfers,
      icon: <Shuffle className="w-5 h-5" />,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      key: 'transactionCount',
      label: 'Transactions',
      value: stats.transactionCount,
      icon: <MoreHorizontal className="w-5 h-5" />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  const formatStatValue = (stat: (typeof statCards)[number]) => {
    const isVisible = visibleCards[stat.key]

    if (typeof stat.value === 'number' && stat.label !== 'Transactions' && !isVisible) {
      return '••••••'
    }

    if (typeof stat.value === 'number' && stat.label !== 'Transactions') {
      return formatMoney(Math.abs(stat.value), currency, false)
    }
    return stat.value
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-3 sm:p-6 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className={`${stat.bgColor} ${stat.color} p-2 sm:p-3 rounded-lg shrink-0`}>
              {stat.icon}
            </div>
            {stat.key !== 'transactionCount' && (
              <button
                type="button"
                onClick={() => setVisibleCards((current) => ({ ...current, [stat.key]: !current[stat.key] }))}
                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label={visibleCards[stat.key] ? `Hide ${stat.label}` : `Show ${stat.label}`}
              >
                {visibleCards[stat.key] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{stat.label}</p>
          {isLoading ? (
            <div className="h-8 bg-secondary rounded animate-pulse" />
          ) : (
            <p className={`text-lg sm:text-2xl font-bold ${stat.color} truncate`}>
              {formatStatValue(stat)}
            </p>
          )}
        </div>
      ))}
      </div>
    </div>
  )
}
