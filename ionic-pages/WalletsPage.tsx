import WalletList from '@/components/wallets/wallet-list'
import { IonPage, IonContent } from '@ionic/react'

export default function WalletsPage() {
  return (
    <IonPage>
      <IonContent className="min-h-screen bg-background text-foreground transition-colors duration-300 p-6">
        <h1 className="text-2xl font-bold mb-4">Wallets</h1>
        <WalletList />
      </IonContent>
    </IonPage>
  )
}
