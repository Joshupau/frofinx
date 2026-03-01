import BudgetList from '@/components/budgets/budget-list'
import { IonPage, IonContent } from '@ionic/react'

export default function BudgetsPage() {
  return (
    <IonPage>
      <IonContent className="min-h-screen bg-background text-foreground transition-colors duration-300 p-6">
        <h1 className="text-2xl font-bold mb-4">Budgets</h1>
        <BudgetList />
      </IonContent>
    </IonPage>
  )
}
