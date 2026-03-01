"use client"
import React from 'react'

export default function MarkPaidModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h3 className="font-semibold">Mark Bill as Paid</h3>
        <p className="mt-2">Confirm payment and record transaction.</p>
        <div className="mt-4 flex justify-end">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary">Confirm</button>
        </div>
      </div>
    </div>
  )
}
