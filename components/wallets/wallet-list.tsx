"use client"
import { useState } from 'react'
import WalletDetail from './wallet-detail'

const sample = [
  { id: 'w1', name: 'Main Wallet', balance: '$12,345.00' },
  { id: 'w2', name: 'Savings', balance: '$100,000.00' },
]

export default function WalletList() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className="space-y-3">
      {sample.map(w => (
        <div key={w.id} className="p-3 bg-card rounded flex justify-between items-center">
          <div>
            <div className="font-medium">{w.name}</div>
            <div className="text-sm text-muted-foreground">{w.balance}</div>
          </div>
          <div>
            <button className="btn" onClick={() => setSelected(w.id)}>Open</button>
          </div>
        </div>
      ))}

      {selected && <WalletDetail walletId={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
