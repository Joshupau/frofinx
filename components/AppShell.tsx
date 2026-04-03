'use client';

import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, useLocation } from 'react-router-dom';
import Providers from '@/queries/query-provider';
import Navbar from '@/components/navbar';
import { FloatingAgent } from '@/components/floating-agent';

import SignInPage from '@/ionic-pages/SignInPage';
import SignUpPage from '@/ionic-pages/SignUpPage';
import DashboardPage from '@/ionic-pages/DashboardPage';
import StatisticsPage from '@/ionic-pages/StatisticsPage';
import BillsPage from '@/ionic-pages/BillsPage';
import BudgetsPage from '@/ionic-pages/BudgetsPage';
import CategoriesPage from '@/ionic-pages/CategoriesPage';
import SettingsPage from '@/ionic-pages/SettingsPage';
import { TransactionsPage } from '@/ionic-pages/TransactionsPage';
import { WalletsPage } from '@/ionic-pages/WalletsPage';

setupIonicReact({
  mode: 'md', // Use Material Design by default, auto-switches on iOS
});

function AppShellInner() {
  const location = useLocation();
  const hideNav = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!hideNav && <Navbar />}
      <div className="flex-1 relative">
        <IonRouterOutlet id="main-content" style={{ height: '100%', position: 'relative', display: 'block' }}>
          <Route exact path="/signin" component={SignInPage} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/dashboard" component={DashboardPage} />
          <Route exact path="/statistics" component={StatisticsPage} />
          <Route exact path="/wallets" component={WalletsPage} />
          <Route exact path="/transactions" component={TransactionsPage} />
          <Route exact path="/bills" component={BillsPage} />
          <Route exact path="/budgets" component={BudgetsPage} />
          <Route exact path="/categories" component={CategoriesPage} />
          <Route exact path="/settings" component={SettingsPage} />
          <Route exact path="/">
            <Redirect to="/signin" />
          </Route>
        </IonRouterOutlet>
      </div>
      {!hideNav && <FloatingAgent />}
    </div>
  );
}

export default function AppShell() {
  return (
    <Providers>
      <IonApp>
        <IonReactRouter>
          <AppShellInner />
        </IonReactRouter>
      </IonApp>
    </Providers>
  );
}
