'use client'

import { ArrowUpRight, ArrowDownLeft, Zap, Home, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

interface Transaction {
  id: string
  title: string
  description: string
  date: string
  amount: string
  type: 'income' | 'expense'
  icon: React.ReactNode
  status: 'completed' | 'pending'
}

const transactions: Transaction[] = [
  {
    id: '1',
    title: 'Salary Deposit',
    description: 'Monthly salary',
    date: 'Jan 18, 2026',
    amount: '+$5,200.00',
    type: 'income',
    icon: <ArrowUpRight className="w-5 h-5" />,
    status: 'completed',
  },
  {
    id: '2',
    title: 'Rent Payment',
    description: 'Monthly rent',
    date: 'Jan 17, 2026',
    amount: '-$1,500.00',
    type: 'expense',
    icon: <ArrowDownLeft className="w-5 h-5" />,
    status: 'completed',
  },
  {
    id: '3',
    title: 'Grocery Shopping',
    description: 'Weekly groceries',
    date: 'Jan 16, 2026',
    amount: '-$245.30',
    type: 'expense',
    icon: <ArrowDownLeft className="w-5 h-5" />,
    status: 'completed',
  },
  {
    id: '4',
    title: 'Investment Return',
    description: 'Portfolio gains',
    date: 'Jan 15, 2026',
    amount: '+$890.00',
    type: 'income',
    icon: <ArrowUpRight className="w-5 h-5" />,
    status: 'completed',
  },
  {
    id: '5',
    title: 'Utility Bills',
    description: 'Electricity & Water',
    date: 'Jan 14, 2026',
    amount: '-$156.42',
    type: 'expense',
    icon: <ArrowDownLeft className="w-5 h-5" />,
    status: 'pending',
  },
]

export function RecentTransactions() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
        <Link href="#" className="text-sm font-semibold text-accent hover:underline">
          VIEW ALL
        </Link>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-border overflow-y-auto max-h-96">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 hover:bg-secondary transition-colors group"
          >
            {/* Left: Icon & Details */}
            <div className="flex items-center gap-4 flex-1">
              <div className={`p-2.5 rounded-lg transition-colors ${
                transaction.type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-500'
                  : 'bg-amber-400/20 text-amber-400'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="w-5 h-5" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{transaction.title}</p>
                <p className="text-xs text-muted-foreground">{transaction.description}</p>
              </div>
            </div>

            {/* Right: Amount & Status */}
            <div className="flex items-center gap-4 text-right">
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${
                  transaction.type === 'income'
                    ? 'text-emerald-500'
                    : 'text-foreground'
                }`}>
                  {transaction.amount}
                </p>
                <p className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                  transaction.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : 'bg-amber-400/20 text-amber-400'
                }`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
