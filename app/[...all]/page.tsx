import AppWrapper from '../../components/AppWrapper'
// import { setupIonicReact } from '@ionic/react'

// setupIonicReact();

export async function generateStaticParams() {
  return [
    { all: ['signin'] },
    { all: ['signup'] },
    { all: ['dashboard'] },
    { all: ['transactions'] },
    { all: ['budgets'] },
    { all: ['bills'] },
    { all: ['reports'] },
    { all: ['settings'] },
    
  ]
}

export default function Page() {
  return <AppWrapper />
}
