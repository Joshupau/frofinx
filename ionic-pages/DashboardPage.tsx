'use client';

import Navbar from '@/components/navbar';
import { arrowDown, arrowUp, card, cash, trendingUp, wallet } from 'ionicons/icons';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThemeStore } from '@/store/theme-store';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonBadge,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/react';

export default function DashboardPage() {
  const isMobile = useIsMobile();
  const { isDarkMode } = useThemeStore();

  // Sample data
  const stats = [
    {
      title: 'Total Balance',
      value: '$124,592.00',
      change: '+12.5%',
      isPositive: true,
      icon: wallet,
      color: 'bg-blue-500',
    },
    {
      title: 'Income',
      value: '$45,231.89',
      change: '+8.2%',
      isPositive: true,
      icon: trendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Expenses',
      value: '$12,426.00',
      change: '-4.3%',
      isPositive: false,
      icon: card,
      color: 'bg-orange-500',
    },
    {
      title: 'Investments',
      value: '$32,940.00',
      change: '+23.1%',
      isPositive: true,
      icon: cash,
      color: 'bg-purple-500',
    },
  ];

  const recentTransactions = [
    { id: 1, name: 'Salary Deposit', amount: '+$5,200.00', date: 'Jan 18, 2026', category: 'Income', status: 'completed' },
    { id: 2, name: 'Rent Payment', amount: '-$1,500.00', date: 'Jan 17, 2026', category: 'Housing', status: 'completed' },
    { id: 3, name: 'Grocery Shopping', amount: '-$245.30', date: 'Jan 16, 2026', category: 'Food', status: 'completed' },
    { id: 4, name: 'Investment Return', amount: '+$890.00', date: 'Jan 15, 2026', category: 'Investment', status: 'completed' },
    { id: 5, name: 'Utility Bills', amount: '-$156.42', date: 'Jan 14, 2026', category: 'Bills', status: 'pending' },
  ];

  return (
    <IonPage>
      <Navbar />
      <IonContent className="ion-padding">
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Welcome back! Here's your financial overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <IonCard key={index} className="hover:shadow-lg transition-shadow">
                  <IonCardContent className="p-6 space-y-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                        <IonIcon icon={stat.icon} className="w-6 h-6 text-white" />
                      </div>
                      <IonBadge color={stat.isPositive ? 'success' : 'danger'} className="gap-1">
                        <IonIcon icon={stat.isPositive ? arrowUp : arrowDown} className="w-3 h-3" />
                        {stat.change}
                      </IonBadge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Transactions */}
              <IonCard className="lg:col-span-2">
                <IonCardHeader>
                  <div className="flex items-center justify-between">
                    <IonCardTitle>Recent Transactions</IonCardTitle>
                    <IonButton fill="clear" size="small">
                      View All
                    </IonButton>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <IonItem key={transaction.id} lines="none" className="p-4 hover:bg-accent/50 rounded-lg transition-colors">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                transaction.amount.startsWith('+') ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                              }`}
                            >
                              <IonIcon
                                icon={transaction.amount.startsWith('+') ? arrowDown : arrowUp}
                                className={`w-5 h-5 ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'} rotate-180`}
                              />
                            </div>
                            <div>
                              <IonLabel>
                                <p className="font-medium">{transaction.name}</p>
                                <p className="text-sm text-muted-foreground">{transaction.date}</p>
                              </IonLabel>
                            </div>
                          </div>
                          <div className="text-right flex flex-col gap-1">
                            <p className={`font-semibold ${transaction.amount.startsWith('+') ? 'text-green-600' : ''}`}>
                              {transaction.amount}
                            </p>
                            <IonBadge color={transaction.status === 'completed' ? 'primary' : 'medium'} className="w-fit ml-auto">
                              {transaction.status}
                            </IonBadge>
                          </div>
                        </div>
                      </IonItem>
                    ))}
                  </div>
                </IonCardContent>
              </IonCard>

              {/* Quick Actions */}
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Quick Actions</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="space-y-3">
                    <IonButton expand="block" size="large">
                      <IonIcon slot="start" icon={cash} />
                      Transfer Money
                    </IonButton>
                    <IonButton expand="block" size="large" fill="outline">
                      <IonIcon slot="start" icon={card} />
                      Pay Bills
                    </IonButton>
                    <IonButton expand="block" size="large" fill="outline">
                      <IonIcon slot="start" icon={trendingUp} />
                      Invest
                    </IonButton>
                  </div>

                  <div className="border-t border-border my-6"></div>

                  {/* Account Summary */}
                  <div>
                    <h3 className="text-sm font-semibold mb-4">Account Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available Balance</span>
                        <span className="font-semibold">$89,235.58</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-semibold">$2,426.42</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credit Limit</span>
                        <span className="font-semibold">$50,000.00</span>
                      </div>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
