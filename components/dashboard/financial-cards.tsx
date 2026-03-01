export function FinancialCards() {
  const cards = [
    { title: 'Total Balance', value: '$124,592.00', subtitle: 'All wallets' },
    { title: 'This Month Income', value: '$12,345.00', subtitle: 'March' },
    { title: 'This Month Expense', value: '$4,321.00', subtitle: 'March' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.title} className="p-4 bg-card rounded-md shadow-sm">
          <div className="text-sm text-muted-foreground">{c.title}</div>
          <div className="text-xl font-semibold">{c.value}</div>
          <div className="text-xs text-muted-foreground">{c.subtitle}</div>
        </div>
      ))}
    </div>
  )
}
