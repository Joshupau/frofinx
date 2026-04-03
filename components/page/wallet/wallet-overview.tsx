'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Wallet, PiggyBank, CreditCard, Eye, EyeOff } from 'lucide-react'
import { useSettingsStore } from '@/store/settings-store'
import { formatMoney } from '@/utils/formatter'

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
  const { hideAmountsOnOpen } = useSettingsStore()
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setVisibleCards({
      totalBalance: !hideAmountsOnOpen,
      monthlyIncome: !hideAmountsOnOpen,
      monthlyExpense: !hideAmountsOnOpen,
    })
  }, [hideAmountsOnOpen])

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-3 sm:p-6 min-w-0 relative">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Balance</p>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-lg shrink-0">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <button
                type="button"
                onClick={() => setVisibleCards((current) => ({ ...current, totalBalance: !current.totalBalance }))}
                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label={visibleCards.totalBalance ? 'Hide total balance' : 'Show total balance'}
              >
                {visibleCards.totalBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{visibleCards.totalBalance ? formatMoney(totalBalance, currency, false) : '••••••'}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">Across {activeWallets} active wallet{activeWallets !== 1 ? 's' : ''}</p>
        </div>

        {/* Active Wallets Card */}
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-lg p-3 sm:p-6 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Wallets</p>
            <div className="p-2 bg-accent/20 rounded-lg shrink-0">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{activeWallets}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">of {totalWallets} total</p>
        </div>

        {/* Monthly Income Card */}
        <div className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-lg p-3 sm:p-6 min-w-0 relative">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">This Month Income</p>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success/20 rounded-lg shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
              </div>
              <button
                type="button"
                onClick={() => setVisibleCards((current) => ({ ...current, monthlyIncome: !current.monthlyIncome }))}
                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label={visibleCards.monthlyIncome ? 'Hide monthly income' : 'Show monthly income'}
              >
                {visibleCards.monthlyIncome ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{visibleCards.monthlyIncome ? formatMoney(monthlyIncome, currency, false) : '••••••'}</p>
          <p className="text-[10px] sm:text-xs text-success mt-2">+12.5% from last month</p>
        </div>

        {/* Monthly Expense Card */}
        <div className="bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/30 rounded-lg p-3 sm:p-6 min-w-0 relative">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">This Month Expense</p>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-warning/20 rounded-lg shrink-0">
                <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
              </div>
              <button
                type="button"
                onClick={() => setVisibleCards((current) => ({ ...current, monthlyExpense: !current.monthlyExpense }))}
                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label={visibleCards.monthlyExpense ? 'Hide monthly expense' : 'Show monthly expense'}
              >
                {visibleCards.monthlyExpense ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{visibleCards.monthlyExpense ? formatMoney(monthlyExpense, currency, false) : '••••••'}</p>
          <p className="text-[10px] sm:text-xs text-warning mt-2">-8.3% from last month</p>
        </div>
      </div>
    </div>
  )
}
