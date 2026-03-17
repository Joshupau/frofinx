
import { useState } from 'react'
import { DashboardHeader } from '@/components/page/dashboard/dashboard-header'
import { FinancialCards } from '@/components/page/dashboard/financial-cards'
import { RecentTransactions } from '@/components/page/dashboard/recent-transactions'

import { IonPage, IonContent } from '@ionic/react'

function IonicPage({ children }: { children: React.ReactNode }) {
  return <IonPage>{children}</IonPage>
}

function IonicContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <IonContent className={className}>{children}</IonContent>
}

type PeriodType = 'today' | 'week' | 'month' | 'year' | 'all'

export default function DashboardPage() {
  const [period, setPeriod] = useState<PeriodType>('month')

  const periodOptions: { label: string; value: PeriodType }[] = [
    { label: 'Today', value: 'today' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
    { label: 'All Time', value: 'all' },
  ]

  return (
    <IonicPage>
      <IonicContent className="min-h-screen bg-background text-foreground">
        {/* Header */}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section with Filter */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="period-filter" className="text-sm font-medium text-muted-foreground">
                Period:
              </label>
              <select
                id="period-filter"
                value={period}
                onChange={(e) => setPeriod(e.target.value as PeriodType)}
                className="px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-medium hover:border-foreground/50 transition-colors cursor-pointer"
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Financial Cards */}
          <div className="mb-8">
            <FinancialCards period={period} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <RecentTransactions />
            </div>


          </div>
        </main>
      </IonicContent>
    </IonicPage>
  )
}
