"use client"

import { useEffect } from 'react'

export default function InitialLoader() {
  useEffect(() => {
    const el = document.getElementById('app-loading')
    if (!el) return
    // fade out then remove
    el.style.transition = 'opacity 250ms ease'
    el.style.opacity = '0'
    const t = setTimeout(() => el.remove(), 300)
    return () => clearTimeout(t)
  }, [])

  return null
}
