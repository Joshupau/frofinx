import '@/components/ui/loader'
import { IonPage, IonContent } from '@ionic/react'

export default function SettingsPage() {
  return (
    <IonPage>
      <IonContent className="min-h-screen bg-background text-foreground transition-colors duration-300 p-6">
        <h1 className="text-2xl font-bold mb-4">Settings / Profile</h1>
        <p>Profile settings will go here.</p>
      </IonContent>
    </IonPage>
  )
}
