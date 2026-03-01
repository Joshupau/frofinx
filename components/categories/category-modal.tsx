"use client"
import React from 'react'

export default function CategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h3 className="font-semibold">Add Category</h3>
        <form className="mt-4 space-y-3">
          <input className="input" placeholder="Name" />
          <div className="flex justify-end">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
