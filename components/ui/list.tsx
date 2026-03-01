import React from 'react'

export default function List({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}
