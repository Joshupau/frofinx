import BillList from '@/components/bills/bill-list'
import { IonPage, IonContent } from '@ionic/react'

export default function BillsPage() {
  return (
    <IonPage>
      <IonContent className="min-h-screen bg-background text-foreground transition-colors duration-300 p-6">
        <h1 className="text-2xl font-bold mb-4">Bills</h1>
        <BillList />
      </IonContent>
    </IonPage>
  )
}
