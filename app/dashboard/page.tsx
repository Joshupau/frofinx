'use client'

import Navbar from '@/components/navbar'
import { ArrowDown, ArrowUp, CreditCard, DollarSign, TrendingUp, Users, Wallet } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useThemeStore } from '@/store/theme-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function DashboardPage() {
    const isMobile = useIsMobile()
    const { isDarkMode } = useThemeStore()
    // Sample data
    const stats = [
        {
            title: 'Total Balance',
            value: '$124,592.00',
            change: '+12.5%',
            isPositive: true,
            icon: Wallet,
            color: 'bg-blue-500'
        },
        {
            title: 'Income',
            value: '$45,231.89',
            change: '+8.2%',
            isPositive: true,
            icon: TrendingUp,
            color: 'bg-green-500'
        },
        {
            title: 'Expenses',
            value: '$12,426.00',
            change: '-4.3%',
            isPositive: false,
            icon: CreditCard,
            color: 'bg-orange-500'
        },
        {
            title: 'Investments',
            value: '$32,940.00',
            change: '+23.1%',
            isPositive: true,
            icon: DollarSign,
            color: 'bg-purple-500'
        }
    ]

    const recentTransactions = [
        { id: 1, name: 'Salary Deposit', amount: '+$5,200.00', date: 'Jan 18, 2026', category: 'Income', status: 'completed' },
        { id: 2, name: 'Rent Payment', amount: '-$1,500.00', date: 'Jan 17, 2026', category: 'Housing', status: 'completed' },
        { id: 3, name: 'Grocery Shopping', amount: '-$245.30', date: 'Jan 16, 2026', category: 'Food', status: 'completed' },
        { id: 4, name: 'Investment Return', amount: '+$890.00', date: 'Jan 15, 2026', category: 'Investment', status: 'completed' },
        { id: 5, name: 'Utility Bills', amount: '-$156.42', date: 'Jan 14, 2026', category: 'Bills', status: 'pending' }
    ]

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Welcome back! Here's your financial overview.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 space-y-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <Badge variant={stat.isPositive ? "default" : "destructive"} className="gap-1">
                                        {stat.isPositive ? (
                                            <ArrowUp className="w-3 h-3" />
                                        ) : (
                                            <ArrowDown className="w-3 h-3" />
                                        )}
                                        {stat.change}
                                    </Badge>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Transactions */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Transactions</CardTitle>
                                <Button variant="link" size="sm">
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-accent/50 rounded-lg transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                transaction.amount.startsWith('+') ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                                            }`}>
                                                {transaction.amount.startsWith('+') ? (
                                                    <ArrowDown className="w-5 h-5 text-green-600 rotate-180" />
                                                ) : (
                                                    <ArrowUp className="w-5 h-5 text-red-600 rotate-180" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{transaction.name}</p>
                                                <p className="text-sm text-muted-foreground">{transaction.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col gap-1">
                                            <p className={`font-semibold ${
                                                transaction.amount.startsWith('+') ? 'text-green-600' : ''
                                            }`}>
                                                {transaction.amount}
                                            </p>
                                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="w-fit ml-auto">
                                                {transaction.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Button className="w-full" size="lg">
                                    <DollarSign className="w-5 h-5" />
                                    Transfer Money
                                </Button>
                                <Button variant="outline" className="w-full" size="lg">
                                    <CreditCard className="w-5 h-5" />
                                    Pay Bills
                                </Button>
                                <Button variant="outline" className="w-full" size="lg">
                                    <TrendingUp className="w-5 h-5" />
                                    Invest
                                </Button>
                            </div>

                            <Separator className="my-6" />

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
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
