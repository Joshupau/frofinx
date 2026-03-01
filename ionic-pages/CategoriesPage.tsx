import CategoryList from '@/components/categories/category-list'
import { IonPage, IonContent } from '@ionic/react'

export default function CategoriesPage() {
  return (
    <IonPage>
      <IonContent className="min-h-screen bg-background text-foreground transition-colors duration-300 p-6">
        <h1 className="text-2xl font-bold mb-4">Categories</h1>
        <CategoryList />
      </IonContent>
    </IonPage>
  )
}
