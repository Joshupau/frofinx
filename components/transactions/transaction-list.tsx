"use client"
import TransactionFilters from './transaction-filters'

const sample = [
  { id: 't1', date: '2026-03-01', amount: '$120.00', desc: 'Groceries' },
  { id: 't2', date: '2026-03-02', amount: '$50.00', desc: 'Taxi' },
]

export default function TransactionList() {
  return (
    <div>
      <TransactionFilters />
      <div className="mt-4 space-y-2">
        {sample.map(t => (
          <div key={t.id} className="p-3 bg-card rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{t.desc}</div>
                <div className="text-sm text-muted-foreground">{t.date}</div>
              </div>
              <div className="font-semibold">{t.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
