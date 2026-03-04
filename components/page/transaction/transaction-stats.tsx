'use client'

import { TrendingUp, TrendingDown, Shuffle, MoreHorizontal } from 'lucide-react'

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
  const statCards = [
    {
      label: 'Total Income',
      value: stats.totalIncome,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Total Expenses',
      value: stats.totalExpense,
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Transfers',
      value: stats.totalTransfers,
      icon: <Shuffle className="w-5 h-5" />,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Transactions',
      value: stats.transactionCount,
      icon: <MoreHorizontal className="w-5 h-5" />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
              {stat.icon}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
          {isLoading ? (
            <div className="h-8 bg-secondary rounded animate-pulse" />
          ) : (
            <p className={`text-2xl font-bold ${stat.color}`}>
              {typeof stat.value === 'number' && stat.value > 100 ? `₱${Math.abs(stat.value).toLocaleString('en-US', { maximumFractionDigits: 0 })}` : stat.value}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
