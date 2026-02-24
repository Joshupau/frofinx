'use client';

import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { useEffect } from 'react';
import Providers from '@/queries/query-provider';
import { useThemeStore } from '@/store/theme-store';

import SignInPage from '@/ionic-pages/SignInPage';
import SignUpPage from '@/ionic-pages/SignUpPage';
import DashboardPage from '@/ionic-pages/DashboardPage';

setupIonicReact({
  mode: 'md', // Use Material Design by default, auto-switches on iOS
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return <>{children}</>;
}

export default function AppShell() {
  return (
    <Providers>
      <ThemeProvider>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path="/signin" component={SignInPage} />
              <Route exact path="/signup" component={SignUpPage} />
              <Route exact path="/dashboard" component={DashboardPage} />
              <Route exact path="/">
                <Redirect to="/signin" />
              </Route>
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </ThemeProvider>
    </Providers>
  );
}
