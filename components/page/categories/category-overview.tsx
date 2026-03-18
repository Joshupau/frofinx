'use client'

import { Tag, PieChart, TrendingUp, AlertCircle } from 'lucide-react'

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
  const budget = monthlyBudget.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Categories Card */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">Total Categories</p>
          <div className="p-2.5 bg-primary/20 rounded-lg">
            <Tag className="w-5 h-5 text-primary" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{totalCategories}</p>
        <p className="text-xs text-muted-foreground mt-2">Active in your profile</p>
      </div>

      {/* Most Used Category Card */}
      <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">Top Category</p>
          <div className="p-2.5 bg-accent/20 rounded-lg">
            <PieChart className="w-5 h-5 text-accent" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground truncate">{mostUsedCategory}</p>
        <p className="text-xs text-muted-foreground mt-2">By transaction count</p>
      </div>

      {/* Monthly Budget Card */}
      <div className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
          <div className="p-2.5 bg-success/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{currency} {budget}</p>
        <p className="text-xs text-success mt-2">+5.2% from last month</p>
      </div>

      {/* Budget Alerts Card */}
      <div className="bg-gradient-to-br from-destructive/20 to-destructive/5 border border-destructive/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">Budget Alerts</p>
          <div className="p-2.5 bg-destructive/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{budgetAlerts}</p>
        <p className="text-xs text-destructive mt-2">Categories over budget</p>
      </div>
    </div>
  )
}
