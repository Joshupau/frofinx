import AppWrapper from '../../components/AppWrapper'
// import { setupIonicReact } from '@ionic/react'

// setupIonicReact();

export async function generateStaticParams() {
  return [
    { all: ['signin'] },
    { all: ['signup'] },
    { all: ['dashboard'] },
  ]
}

export default function Page() {
  return <AppWrapper />
}
