'use client'
import React, { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import BudgetModal from './budget-modal'
import { useListBudgets, useUpdateBudget } from '@/queries/user/budget/budgets'

interface BudgetViewModel {
  id: string
  name: string
  amount: number
  spent: number
  period: string
  percentageUsed: number
}

interface BudgetApiItem {
  _id?: string
  id?: string
  name?: string
  amount?: number
  spent?: number
  period?: string
}

const normalizeBudget = (budget: BudgetApiItem, index: number): BudgetViewModel => {
  const resolvedId = budget._id ?? budget.id ?? `budget-${index}`
  const budgetAmount = Number(budget.amount) || 0
  const spentAmount = Number(budget.spent) || 0
  const percentageUsed = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0

  return {
    id: resolvedId,
    name: budget.name || 'Untitled Budget',
    amount: budgetAmount,
    spent: spentAmount,
    period: budget.period || 'monthly',
    percentageUsed: Math.min(percentageUsed, 100),
  }
}

export default function BudgetList() {
  const [open, setOpen] = useState(false)

  const { data: budgetResponse, isLoading, refetch } = useListBudgets()
  const { mutate: updateBudget } = useUpdateBudget()

  const budgets = useMemo(() => {
    const responseData = budgetResponse?.data as
      | BudgetApiItem[]
      | { items?: BudgetApiItem[]; budgets?: BudgetApiItem[] }
      | undefined

    if (Array.isArray(responseData)) {
      return responseData.map((budget, budgetIndex) => normalizeBudget(budget, budgetIndex))
    }

    if (responseData && Array.isArray(responseData.items)) {
      return responseData.items.map((budget, budgetIndex) => normalizeBudget(budget, budgetIndex))
    }

    if (responseData && Array.isArray(responseData.budgets)) {
      return responseData.budgets.map((budget, budgetIndex) => normalizeBudget(budget, budgetIndex))
    }

    return []
  }, [budgetResponse])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Your Budgets</h2>
        <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          New Budget
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="h-24 rounded-lg bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : budgets.length > 0 ? (
        <div className="space-y-2">
          {budgets.map((b) => (
            <div key={b.id} className="p-4 bg-gradient-to-br from-card to-secondary border border-border rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground uppercase">{b.period}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">${b.spent.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">of ${b.amount.toFixed(2)}</div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    b.percentageUsed > 80 ? 'bg-destructive' : 'bg-success'
                  }`}
                  style={{ width: `${b.percentageUsed}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {b.percentageUsed.toFixed(0)}% used
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-gradient-to-br from-card to-secondary border border-border rounded-xl text-center">
          <p className="text-muted-foreground mb-4">No budgets found</p>
          <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Your First Budget
          </Button>
        </div>
      )}

      <BudgetModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
