"use client"
import React from 'react'

export default function TransactionFilters() {
  return (
    <div className="flex gap-2">
      <input className="input" placeholder="Start date" />
      <input className="input" placeholder="End date" />
      <select className="input">
        <option>All wallets</option>
      </select>
      <button className="btn">Apply</button>
    </div>
  )
}
