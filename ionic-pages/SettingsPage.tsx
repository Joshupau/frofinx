import '@/components/ui/loader'
import { SettingsPageContent } from '@/components/page/settings/settings-page'
import { IonContent, IonPage } from '@ionic/react'

export default function SettingsPage() {
  return (
    <IonPage>
      <IonContent className="bg-background text-foreground">
        <SettingsPageContent />
      </IonContent>
    </IonPage>
  )
}
