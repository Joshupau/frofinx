"use client"
import React from 'react'

export default function WalletDetail({ walletId, onClose }: { walletId: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold">Wallet {walletId}</h2>
        <p>Transactions for this wallet will appear here.</p>
        <div className="mt-4 flex justify-end">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
