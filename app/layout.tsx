'use client'

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/queries/query-provider"
import { Suspense, useEffect } from "react"
import { useThemeStore } from "@/store/theme-store"

const inter = Inter({ subsets: ["latin"] })

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDarkMode])

  return <>{children}</>
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        <Providers>
          <ThemeProvider>
            <Suspense>
              {children}
            </Suspense>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
