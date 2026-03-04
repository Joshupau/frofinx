import { SignupForm } from "@/components/page/signup/SignupForm";
import { IonContent, IonPage } from '@ionic/react'


export default function SignUpPage() {
  return (
    <IonPage>
      <IonContent fullscreen className="bg-white dark:bg-slate-900">
        <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-900">
          {/* Branding column (desktop only) */}
          <div className="hidden md:flex md:w-2/5 relative min-h-screen overflow-hidden border-r border-slate-200 dark:border-slate-700 bg-gradient-to-br from-cyan-100 via-cyan-50 to-blue-50 dark:from-teal-900 dark:via-teal-800 dark:to-slate-900">
            <div className="relative w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
                alt="FroFinX Branding"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/40 via-cyan-50/40 to-blue-50/40 dark:from-teal-900/40 dark:via-teal-800/40 dark:to-slate-900/40" />
            </div>
          </div>

          {/* Form column */}
          <div className="w-full md:w-3/5 flex items-center justify-center px-4 sm:px-6 py-10 md:py-12 bg-white dark:bg-slate-900">
            <div className="w-full max-w-2xl">
              <SignupForm />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
