"use client"

import { useEffect, useRef } from "react"
import { useThemeStore } from "@/store/theme-store"

export default function ThemeInitializer() {
  const isDarkMode = useThemeStore((s) => s.isDarkMode)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    if (isFirstRender.current) {
      // Apply immediately on hydration — no transition to avoid flash
      if (isDarkMode) {
        root.classList.add("dark")
        body.classList.add("dark")
      } else {
        root.classList.remove("dark")
        body.classList.remove("dark")
      }
      isFirstRender.current = false
      return
    }

    // Lock all elements to a single synchronized 300ms transition
    root.classList.add("theme-switching")

    if (isDarkMode) {
      root.classList.add("dark")
      body.classList.add("dark")
    } else {
      root.classList.remove("dark")
      body.classList.remove("dark")
    }

    const timer = setTimeout(() => {
      root.classList.remove("theme-switching")
    }, 320)

    return () => clearTimeout(timer)
  }, [isDarkMode])

  return null
}
