"use client"

import { useEffect, useState } from "react"

export default function DevErrorOverlay() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function onError(e: ErrorEvent) {
      setError(e.message || String(e.error) || "Unknown error")
    }

    function onRejection(e: PromiseRejectionEvent) {
      setError((e.reason && (e.reason.message || String(e.reason))) || "Unhandled promise rejection")
    }

    window.addEventListener("error", onError)
    window.addEventListener("unhandledrejection", onRejection)

    return () => {
      window.removeEventListener("error", onError)
      window.removeEventListener("unhandledrejection", onRejection)
    }
  }, [])

  if (!error) return null

  return (
    <div style={{position: 'fixed', inset: 12, zIndex: 9999}}>
      <div style={{background: 'rgba(0,0,0,0.85)', color: 'white', padding: 12, borderRadius: 6, fontFamily: 'monospace', whiteSpace: 'pre-wrap'}}>
        <strong>Client runtime error detected:</strong>
        <div style={{marginTop: 8}}>{error}</div>
      </div>
    </div>
  )
}
