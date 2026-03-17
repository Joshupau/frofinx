import { SigninForm } from "@/components/page/signin/SigninForm";
import { IonContent, IonPage } from '@ionic/react'


export default function SignInPage() {
  return (
    <IonPage>
      <IonContent fullscreen className="min-h-screen bg-background">
        <div className="min-h-screen flex flex-col md:flex-row bg-background">
          <div className="hidden md:flex md:w-2/5 relative min-h-screen overflow-hidden border-r border-border">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/60 via-blue-700/60 to-indigo-900/70" />
            <div className="relative z-10 flex w-full h-full items-center justify-center text-white text-center px-6">
              <div>
                <p className="text-lg font-semibold uppercase tracking-[0.3em]">FroFinX</p>
                <p className="mt-4 text-sm text-white/80">Build your financial future with confidence.</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/5 flex items-center justify-center px-4 sm:px-6 py-10 md:py-12 bg-background">
            <div className="w-full max-w-md">
              <SigninForm />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}