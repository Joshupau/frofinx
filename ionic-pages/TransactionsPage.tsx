import TransactionList from '@/components/transactions/transaction-list'
import { IonPage, IonContent } from '@ionic/react'

export default function TransactionsPage() {
  return (
    <IonPage>
      <IonContent className="min-h-screen bg-background text-foreground transition-colors duration-300 p-6">
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>
        <TransactionList />
      </IonContent>
    </IonPage>
  )
}
