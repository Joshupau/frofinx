"use client"
import React from 'react'

export default function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow max-w-lg w-full">
        {children}
        <div className="mt-2 text-right">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
