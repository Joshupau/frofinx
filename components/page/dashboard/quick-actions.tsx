'use client'

import { Send, CreditCard, TrendingUp } from 'lucide-react'

const actions = [
  {
    title: 'TRANSFER MONEY',
    icon: <Send className="w-5 h-5" />,
    color: 'border-primary text-primary hover:bg-primary/10',
  },
  {
    title: 'PAY BILLS',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'border-primary text-primary hover:bg-primary/10',
  },
  {
    title: 'INVEST',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'border-primary text-primary hover:bg-primary/10',
  },
]

export function QuickActions() {
  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 border-2 rounded-lg font-semibold transition-all duration-200 ${action.color}`}
          >
            {action.icon}
            {action.title}
          </button>
        ))}
      </div>

      {/* Account Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Account Summary</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Available Balance</span>
            <span className="text-lg font-bold text-success">$89,235.58</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Pending</span>
            <span className="text-lg font-bold text-warning">$2,426.42</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Credit Limit</span>
            <span className="text-lg font-bold text-foreground">$50,000.00</span>
          </div>
        </div>
      </div>
    </div>
  )
}
