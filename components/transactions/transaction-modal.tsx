"use client"
import React from 'react'

export default function TransactionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h3 className="font-semibold">Create / Edit Transaction</h3>
        <form className="mt-4 space-y-3">
          <input className="input" placeholder="Amount" />
          <input className="input" placeholder="Category" />
          <textarea className="input" placeholder="Notes" />
          <div className="flex justify-end">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
