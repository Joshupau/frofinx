"use client"
import React, { useState } from 'react'
import CategoryModal from './category-modal'

const defaults = [
  { id: 'c1', name: 'Groceries' },
  { id: 'c2', name: 'Transport' },
]

export default function CategoryList() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Categories</h2>
        <button className="btn" onClick={() => setOpen(true)}>Add</button>
      </div>
      <div className="space-y-2">
        {defaults.map(c => (
          <div key={c.id} className="p-2 bg-card rounded">{c.name}</div>
        ))}
      </div>
      <CategoryModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
