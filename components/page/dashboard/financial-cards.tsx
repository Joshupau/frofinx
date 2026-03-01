'use client'

import { TrendingUp, TrendingDown, Wallet, DollarSign, ShoppingCart, Zap } from 'lucide-react'

interface FinancialCard {
  title: string
  amount: string
  change: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'orange' | 'purple'
}

const cards: FinancialCard[] = [
  {
    title: 'Total Balance',
    amount: '$124,592.00',
    change: 12.5,
    icon: <Wallet className="w-6 h-6" />,
    color: 'blue',
  },
  {
    title: 'Income',
    amount: '$45,231.89',
    change: 8.2,
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'green',
  },
  {
    title: 'Expenses',
    amount: '$12,426.00',
    change: -4.3,
    icon: <ShoppingCart className="w-6 h-6" />,
    color: 'orange',
  },
  {
    title: 'Investments',
    amount: '$32,940.00',
    change: 23.1,
    icon: <Zap className="w-6 h-6" />,
    color: 'purple',
  },
]

const colorMap = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  orange: 'bg-amber-400',
  purple: 'bg-purple-500',
}

export function FinancialCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const isPositive = card.change >= 0
        return (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-4">
              <div className={`${colorMap[card.color]} p-3 rounded-lg text-white group-hover:shadow-lg transition-shadow`}>
                {card.icon}
              </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                isPositive
                  ? 'bg-emerald-500/20 text-emerald-500'
                  : 'bg-destructive/20 text-destructive'
              }`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{card.change}%
              </div>
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{card.title}</h3>

            {/* Amount */}
            <p className="text-2xl font-bold text-foreground">{card.amount}</p>
          </div>
        )
      })}
    </div>
  )
}
