"use client"
import { useState } from 'react'
import WalletDetail from './wallet-detail'
import { useSettingsStore } from '@/store/settings-store'
import { formatMoney } from '@/utils/formatter'

const sample = [
  { id: 'w1', name: 'Main Wallet', balance: 12345 },
  { id: 'w2', name: 'Savings', balance: 100000 },
]

export default function WalletList() {
  const [selected, setSelected] = useState<string | null>(null)
  const { currency, hideAmountsOnOpen } = useSettingsStore()
  return (
    <div className="space-y-3">
      {sample.map(w => (
        <div key={w.id} className="p-3 bg-card rounded flex justify-between items-center">
          <div>
            <div className="font-medium">{w.name}</div>
            <div className="text-sm text-muted-foreground">{formatMoney(w.balance, currency, hideAmountsOnOpen)}</div>
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
