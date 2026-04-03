import AppWrapper from '../../components/AppWrapper'

export const dynamicParams = false

export async function generateStaticParams() {
  return [
    { all: ['signin'] },
    { all: ['signup'] },
    { all: ['dashboard'] },
    { all: ['statistics'] },
    { all: ['wallets'] },
    { all: ['transactions'] },
    { all: ['budgets'] },
    { all: ['bills'] },
    { all: ['categories'] },
    { all: ['settings'] },
  ]
}

export default function Page() {
  return <AppWrapper />
}
