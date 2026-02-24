'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { setupIonicReact } from '@ionic/react'

const App = dynamic(() => import('./AppShell'), {
  ssr: false,
})


export default function AppWrapper() {
  useEffect(() => {
    setupIonicReact()
  }, [])

  return <App />
}
