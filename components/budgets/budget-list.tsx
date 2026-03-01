"use client"
import React, { useState } from 'react'
import BudgetModal from './budget-modal'

const sample = [
  { id: 'bg1', title: 'Groceries', limit: '$500', spent: '$230' },
]

export default function BudgetList() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Your Budgets</h2>
        <button className="btn" onClick={() => setOpen(true)}>New Budget</button>
      </div>
      <div className="space-y-2">
        {sample.map(b => (
          <div key={b.id} className="p-3 bg-card rounded flex justify-between">
            <div>
              <div className="font-medium">{b.title}</div>
              <div className="text-sm text-muted-foreground">Spent {b.spent} of {b.limit}</div>
            </div>
          </div>
        ))}
      </div>
      <BudgetModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
