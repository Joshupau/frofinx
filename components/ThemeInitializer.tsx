"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/store/theme-store"

export default function ThemeInitializer() {
  const isDarkMode = useThemeStore((s) => s.isDarkMode)

  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    if (isDarkMode) {
      root.classList.add("dark")
      body.classList.add("dark")
    } else {
      root.classList.remove("dark")
      body.classList.remove("dark")
    }
  }, [isDarkMode])

  return null
}
