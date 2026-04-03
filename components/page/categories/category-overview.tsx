'use client'

import { Tag, PieChart, TrendingUp, AlertCircle } from 'lucide-react'
import { useSettingsStore } from '@/store/settings-store'
import { formatMoney } from '@/utils/formatter'

interface CategoryOverviewProps {
  totalCategories: number
  mostUsedCategory: string
  monthlyBudget: number
  budgetAlerts: number
  currency: string
}

export function CategoryOverview({
  totalCategories,
  mostUsedCategory,
  monthlyBudget,
  budgetAlerts,
  currency,
}: CategoryOverviewProps) {
  const { currency: settingsCurrency, hideAmountsOnOpen } = useSettingsStore()
  const resolvedCurrency = currency || settingsCurrency
  const budget = formatMoney(monthlyBudget, resolvedCurrency, hideAmountsOnOpen)

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 mb-8">
      {/* Total Categories Card */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-3 sm:p-6 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Categories</p>
          <div className="p-2 bg-primary/20 rounded-lg shrink-0">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
        </div>
        <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{totalCategories}</p>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">Active in your profile</p>
      </div>

      {/* Most Used Category Card */}
      <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-lg p-3 sm:p-6 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Top Category</p>
          <div className="p-2 bg-accent/20 rounded-lg shrink-0">
            <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
        </div>
        <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{mostUsedCategory}</p>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">By transaction count</p>
      </div>

      {/* Monthly Budget Card */}
      <div className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-lg p-3 sm:p-6 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Budget</p>
          <div className="p-2 bg-success/20 rounded-lg shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
          </div>
        </div>
        <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{budget}</p>
        <p className="text-[10px] sm:text-xs text-success mt-2">+5.2% from last month</p>
      </div>

      {/* Budget Alerts Card */}
      <div className="bg-gradient-to-br from-destructive/20 to-destructive/5 border border-destructive/30 rounded-lg p-3 sm:p-6 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Budget Alerts</p>
          <div className="p-2 bg-destructive/20 rounded-lg shrink-0">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
          </div>
        </div>
        <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{budgetAlerts}</p>
        <p className="text-[10px] sm:text-xs text-destructive mt-2">Categories over budget</p>
      </div>
    </div>
  )
}
