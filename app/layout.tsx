import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import DevOverlayClient from '@/components/DevOverlayClient'
import InitialLoader from '@/components/InitialLoader'
import DevDomGuard from '@/components/DevDomGuard'

import './ionic-theme.css'
import ThemeInitializer from '@/components/ThemeInitializer'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */

/* Optional CSS utils */

import './globals.css'
import DevErrorOverlay from '@/components/DevErrorOverlay'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FroFinX',
  description: 'FroFinX App',
}

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Suppress hydration warnings on the root <html> element. Some browser
    // extensions (e.g. Night Eye) or client-only scripts may mutate the
    // document before React hydrates, causing spurious mismatch errors.
    // This tells React to ignore attribute mismatches here.
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        {/* Server-rendered initial loader — will be removed by `InitialLoader` on client mount */}
        <div id="app-loading" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', zIndex: 9999 }}>
          <svg width="56" height="56" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="25" cy="25" r="20" stroke="#e5e7eb" strokeWidth="6" fill="none" />
            <path d="M45 25a20 20 0 0 1-20 20" stroke="#111827" strokeWidth="6" strokeLinecap="round" fill="none">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
        <ThemeInitializer />
        {process.env.NODE_ENV === 'development' && (
          <>
            {/* Dev overlay to show client runtime errors (visible only in development) */}
            <DevOverlayClient />
            {/* DEBUG: temporary visible marker to verify server-rendered HTML */}
            <div style={{ position: 'fixed', top: 8, right: 8, background: '#ff0', color: '#000', padding: '6px 8px', zIndex: 9999, borderRadius: 4 }}>SSR OK</div>
            <DevDomGuard />
          </>
        )}
        <InitialLoader />
        {children}
      </body>
      <Script type="module" src="https://unpkg.com/ionicons@7.0.0/dist/ionicons/ionicons.esm.js" strategy="lazyOnload" />
      <Script noModule src="https://unpkg.com/ionicons@7.0.0/dist/ionicons/ionicons.js" strategy="lazyOnload" />
    </html>
  )
}
