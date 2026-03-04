'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('./AppShell'), {
  ssr: false,
})


export default function AppWrapper() {
  return <App />
}
