'use client'

import { TrendingUp, Wallet, PiggyBank, CreditCard } from 'lucide-react'

interface WalletOverviewProps {
  totalBalance: number
  currency: string
  activeWallets: number
  totalWallets: number
  monthlyIncome: number
  monthlyExpense: number
}

export function WalletOverview({
  totalBalance,
  currency,
  activeWallets,
  totalWallets,
  monthlyIncome,
  monthlyExpense,
}: WalletOverviewProps) {
  const balance = totalBalance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const income = monthlyIncome.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const expense = monthlyExpense.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
          <div className="p-2.5 bg-primary/20 rounded-lg">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{currency} {balance}</p>
        <p className="text-xs text-muted-foreground mt-2">Across {activeWallets} active wallet{activeWallets !== 1 ? 's' : ''}</p>
      </div>

      {/* Active Wallets Card */}
      <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">Active Wallets</p>
          <div className="p-2.5 bg-accent/20 rounded-lg">
            <CreditCard className="w-5 h-5 text-accent" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{activeWallets}</p>
        <p className="text-xs text-muted-foreground mt-2">of {totalWallets} total</p>
      </div>

      {/* Monthly Income Card */}
      <div className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">This Month Income</p>
          <div className="p-2.5 bg-success/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{currency} {income}</p>
        <p className="text-xs text-success mt-2">+12.5% from last month</p>
      </div>

      {/* Monthly Expense Card */}
      <div className="bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">This Month Expense</p>
          <div className="p-2.5 bg-warning/20 rounded-lg">
            <PiggyBank className="w-5 h-5 text-warning" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{currency} {expense}</p>
        <p className="text-xs text-warning mt-2">-8.3% from last month</p>
      </div>
    </div>
  )
}
