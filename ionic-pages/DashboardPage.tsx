
import { DashboardHeader } from '@/components/page/dashboard/dashboard-header'
import { FinancialCards } from '@/components/page/dashboard/financial-cards'
import { QuickActions } from '@/components/page/dashboard/quick-actions'
import { RecentTransactions } from '@/components/page/dashboard/recent-transactions'

import { IonPage, IonContent } from '@ionic/react'

function IonicPage({ children }: { children: React.ReactNode }) {
  return <IonPage>{children}</IonPage>
}

function IonicContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <IonContent className={className}>{children}</IonContent>
}

export default function DashboardPage() {
  return (
    <IonicPage>
      <IonicContent className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Header */}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
          </div>

          {/* Financial Cards */}
          <div className="mb-8">
            <FinancialCards />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <RecentTransactions />
            </div>

            {/* Quick Actions - Takes 1 column */}
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
          </div>
        </main>
      </IonicContent>
    </IonicPage>
  )
}
