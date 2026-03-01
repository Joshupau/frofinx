"use client"
import React from 'react'

export default function BudgetDetail({ id }: { id: string }) {
  return (
    <div>
      <h2 className="text-lg font-medium">Budget {id}</h2>
      <p>Spent / remaining and transactions here.</p>
    </div>
  )
}
