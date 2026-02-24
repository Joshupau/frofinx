import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

import './globals.css'
import './ionic-theme.css'
import ThemeInitializer from '@/components/ThemeInitializer'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
// Optional: float utilities cause Turbopack CSS parsing errors (:host-context)
// Removed import to avoid parser issues; enable if using webpack or provide a local replacement
// import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
// import { setupIonicReact } from '@ionic/react'

// setupIonicReact();
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
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeInitializer />
        {children}
      </body>
      <Script type="module" src="https://unpkg.com/ionicons@7.0.0/dist/ionicons/ionicons.esm.js" strategy="lazyOnload" />
      <Script noModule src="https://unpkg.com/ionicons@7.0.0/dist/ionicons/ionicons.js" strategy="lazyOnload" />
    </html>
  )
}
