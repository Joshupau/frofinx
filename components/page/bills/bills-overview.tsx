import { Card, CardContent } from '@/components/ui/card'
import { ReceiptText, AlarmClock, CircleX, CircleCheck } from 'lucide-react'
import { BillSummary } from '@/types/bill'
import { formatCurrency } from '@/utils/formatter'

interface BillsOverviewProps {
  summary: BillSummary
  upcomingCount: number
  overdueCount: number
  isLoading?: boolean
}

export function BillsOverview({ summary, upcomingCount, overdueCount, isLoading }: BillsOverviewProps) {
  const cards = [
    {
      title: 'Total Bill Amount',
      value: formatCurrency(summary.totalAmount),
      note: `${summary.totalBills} total bill${summary.totalBills === 1 ? '' : 's'}`,
      icon: <ReceiptText className="w-5 h-5 text-primary" />,
      iconBg: 'bg-primary/15',
      border: 'border-primary/30',
      background: 'from-primary/15 to-primary/0',
    },
    {
      title: 'Due Soon',
      value: `${upcomingCount}`,
      note: `${summary.unpaidBills} unpaid bill${summary.unpaidBills === 1 ? '' : 's'}`,
      icon: <AlarmClock className="w-5 h-5 text-warning" />,
      iconBg: 'bg-warning/15',
      border: 'border-warning/30',
      background: 'from-warning/15 to-warning/0',
    },
    {
      title: 'Overdue Bills',
      value: `${overdueCount}`,
      note: formatCurrency(summary.unpaidAmount),
      icon: <CircleX className="w-5 h-5 text-destructive" />,
      iconBg: 'bg-destructive/15',
      border: 'border-destructive/30',
      background: 'from-destructive/15 to-destructive/0',
    },
    {
      title: 'Paid Amount',
      value: formatCurrency(summary.paidAmount),
      note: `${summary.paidBills} paid bill${summary.paidBills === 1 ? '' : 's'}`,
      icon: <CircleCheck className="w-5 h-5 text-success" />,
      iconBg: 'bg-success/15',
      border: 'border-success/30',
      background: 'from-success/15 to-success/0',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className={`py-0 border ${card.border} bg-gradient-to-br ${card.background}`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <div className={`p-2 rounded-lg ${card.iconBg}`}>{card.icon}</div>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-secondary rounded-md animate-pulse" />
                <div className="h-4 bg-secondary rounded-md animate-pulse w-2/3" />
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.note}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
