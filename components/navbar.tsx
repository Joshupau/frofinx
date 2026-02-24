'use client';

import { useHistory, useLocation } from 'react-router-dom';
import { notifications, chevronDown, home, logOut, menu, person, settings, trendingUp, wallet, search } from 'ionicons/icons';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThemeStore } from '@/store/theme-store';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonMenu,
  IonContent,
  IonMenuToggle,
  IonAvatar,
} from '@ionic/react';
import ThemeToggle from './theme-toggle';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const isMobile = useIsMobile();
  const { isDarkMode } = useThemeStore();
  const history = useHistory();
  const location = useLocation();

  const handleSignOut = () => {
    history.push('/signin');
  };

  return (
    <>
      {/* Mobile Menu */}
      <IonMenu contentId="main-content" type="overlay">
        <IonContent>
          <IonList>
            <IonMenuToggle>
              <IonItem button onClick={() => history.push('/dashboard')}>
                <IonIcon slot="start" icon={home} />
                <IonLabel>Dashboard</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle>
              <IonItem button onClick={() => history.push('/dashboard/transactions')}>
                <IonIcon slot="start" icon={trendingUp} />
                <IonLabel>Transactions</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle>
              <IonItem button onClick={() => history.push('/dashboard/analytics')}>
                <IonIcon slot="start" icon={trendingUp} />
                <IonLabel>Analytics</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <IonItem>
              <IonSearchbar placeholder="Search..." />
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* Navbar Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar className={isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}>
          {/* Left: Logo and Navigation */}
          <IonButtons slot="start">
            {isMobile && (
              <IonButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <IonIcon icon={menu} />
              </IonButton>
            )}
            
            <div className="flex items-center gap-2 ml-2">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <IonIcon icon={wallet} className="text-white" />
              </div>
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>FroFinX</span>
            </div>
          </IonButtons>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <div className="flex items-center gap-1 ml-8">
              <IonButton
                fill="clear"
                onClick={() => history.push('/dashboard')}
                className={location.pathname === '/dashboard' ? 'ion-activated' : ''}
              >
                <IonIcon slot="start" icon={home} />
                Dashboard
              </IonButton>
              <IonButton
                fill="clear"
                onClick={() => history.push('/dashboard/transactions')}
              >
                <IonIcon slot="start" icon={trendingUp} />
                Transactions
              </IonButton>
              <IonButton
                fill="clear"
                onClick={() => history.push('/dashboard/analytics')}
              >
                <IonIcon slot="start" icon={trendingUp} />
                Analytics
              </IonButton>
            </div>
          )}

          {/* Right: Actions */}
          <IonButtons slot="end">
            {/* Search - Desktop only */}
            {!isMobile && (
              <IonSearchbar placeholder="Search..." className="max-w-xs" />
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <IonButton>
              <IonIcon icon={notifications} />
              <IonBadge color="danger" className="absolute top-1 right-1" style={{ fontSize: '8px' }}>
                3
              </IonBadge>
            </IonButton>

            {/* Profile Popover */}
            <IonButton id="profile-trigger">
              <IonAvatar className="w-8 h-8">
                <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center">
                  <IonIcon icon={person} className="text-white" />
                </div>
              </IonAvatar>
              {!isMobile && <IonIcon icon={chevronDown} />}
            </IonButton>

            <IonPopover trigger="profile-trigger" dismissOnSelect>
              <IonContent>
                <IonList>
                  <IonItem lines="none" className="ion-padding">
                    <IonLabel>
                      <h2 className="font-medium">John Doe</h2>
                      <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem button onClick={() => history.push('/dashboard/profile')}>
                    <IonIcon slot="start" icon={person} />
                    <IonLabel>My Profile</IonLabel>
                  </IonItem>
                  <IonItem button onClick={() => history.push('/dashboard/settings')}>
                    <IonIcon slot="start" icon={settings} />
                    <IonLabel>Settings</IonLabel>
                  </IonItem>
                  <IonItem button onClick={handleSignOut} color="danger">
                    <IonIcon slot="start" icon={logOut} />
                    <IonLabel>Sign Out</IonLabel>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </>
  );
}

