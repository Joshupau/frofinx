"use client"
import React from 'react'

export default function BillDetail({ billId, onClose }: { billId: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold">Bill {billId}</h2>
        <p>Bill details and actions here.</p>
        <div className="mt-4 flex justify-end">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
