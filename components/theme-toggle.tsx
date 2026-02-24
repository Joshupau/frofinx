'use client';

import { moon, sunny } from 'ionicons/icons';
import { useThemeStore } from '@/store/theme-store';
import { IonButton, IonIcon } from '@ionic/react';

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <IonButton
      fill="clear"
      onClick={toggleDarkMode}
      aria-label="Toggle theme"
    >
      <IonIcon icon={isDarkMode ? sunny : moon} />
    </IonButton>
  );
}
