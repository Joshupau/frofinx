"use client"
import React, { useState } from 'react'
import BillDetail from './bill-detail'

const sample = [
  { id: 'b1', title: 'Electricity', due: '2026-03-10', amount: '$60.00' },
  { id: 'b2', title: 'Internet', due: '2026-03-15', amount: '$40.00' },
]

export default function BillList() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className="space-y-2">
      {sample.map(b => (
        <div key={b.id} className="p-3 bg-card rounded flex justify-between items-center">
          <div>
            <div className="font-medium">{b.title}</div>
            <div className="text-sm text-muted-foreground">Due {b.due}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">{b.amount}</div>
            <button className="btn" onClick={() => setSelected(b.id)}>Details</button>
          </div>
        </div>
      ))}

      {selected && <BillDetail billId={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
