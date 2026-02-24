# Migration Guide: shadcn/ui to Ionic React

This document outlines the conversion from shadcn/ui + Radix UI to Ionic React components.

## Overview

The FroFinX app has been successfully migrated from:
- **From**: Next.js App Router + shadcn/ui + Radix UI primitives
- **To**: Next.js Static Export + Ionic React + Capacitor

## Key Changes

### 1. Routing System

**Before (Next.js App Router)**:
```tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

<Link href="/dashboard">Dashboard</Link>
const router = useRouter();
router.push('/signin');
```

**After (React Router v5)**:
```tsx
import { useHistory } from 'react-router-dom';

<a href="/dashboard">Dashboard</a> // or use IonButton with onClick
const history = useHistory();
history.push('/signin');
```

### 2. Page Components

**Before**:
```tsx
export default function Page() {
  return <div>Content</div>
}
```

**After**:
```tsx
import { IonPage, IonContent } from '@ionic/react';

export default function Page() {
  return (
    <IonPage>
      <IonContent>
        <div>Content</div>
      </IonContent>
    </IonPage>
  );
}
```

### 3. Component Conversions

#### Button
**Before**:
```tsx
import { Button } from '@/components/ui/button';

<Button variant="outline" size="lg">Click me</Button>
```

**After**:
```tsx
import { IonButton } from '@ionic/react';

<IonButton fill="outline" size="large">Click me</IonButton>
```

Props mapping:
- `variant="default"` → `fill="solid"`
- `variant="outline"` → `fill="outline"`
- `variant="ghost"` → `fill="clear"`
- `size="sm"` → `size="small"`
- `size="lg"` → `size="large"`
- `expand="block"` → full width button

#### Card
**Before**:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

**After**:
```tsx
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';

<IonCard>
  <IonCardHeader>
    <IonCardTitle>Title</IonCardTitle>
  </IonCardHeader>
  <IonCardContent>Content</IonCardContent>
</IonCard>
```

#### Input
**Before**:
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="Email" />
```

**After**:
```tsx
import { IonItem, IonLabel, IonInput } from '@ionic/react';

<IonItem>
  <IonLabel position="stacked">Email</IonLabel>
  <IonInput type="email" placeholder="Email" />
</IonItem>
```

#### Badge
**Before**:
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="destructive">Error</Badge>
```

**After**:
```tsx
import { IonBadge } from '@ionic/react';

<IonBadge color="danger">Error</IonBadge>
```

Color mapping:
- `variant="default"` → `color="primary"`
- `variant="destructive"` → `color="danger"`
- `variant="secondary"` → `color="medium"`

#### Dropdown Menu → Popover
**Before**:
```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**After**:
```tsx
import { IonButton, IonPopover, IonList, IonItem } from '@ionic/react';

<IonButton id="trigger">Open</IonButton>
<IonPopover trigger="trigger" dismissOnSelect>
  <IonList>
    <IonItem button>Item 1</IonItem>
  </IonList>
</IonPopover>
```

#### Separator
**Before**:
```tsx
import { Separator } from '@/components/ui/separator';

<Separator />
```

**After**:
```tsx
// Use Tailwind or custom CSS
<div className="border-t border-border my-6"></div>
```

### 4. Icons

**Before (lucide-react)**:
```tsx
import { Moon, Sun, User } from 'lucide-react';

<Moon className="w-5 h-5" />
```

**After (ionicons)**:
```tsx
import { moonOutline, sunnyOutline, personOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

<IonIcon icon={moonOutline} />
```

Common icon mappings:
- `Mail` → `mailOutline`
- `Lock` → `lockClosedOutline`
- `User` → `personOutline`
- `Settings` → `settingsOutline`
- `LogOut` → `logOutOutline`
- `Menu` → `menuOutline`
- `X` → `closeOutline`
- `Bell` → `bellOutline`
- `Search` → `searchOutline`
- `Home` → `homeOutline`
- `TrendingUp` → `trendingUpOutline`
- `Wallet` → `walletOutline`
- `Shield` → `shieldCheckmarkOutline`

### 5. Dark Mode

**Before (manual with Zustand)**:
```tsx
// In layout.tsx
useEffect(() => {
  const root = document.documentElement;
  if (isDarkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}, [isDarkMode]);
```

**After (Ionic theming)**:
```tsx
// In layout.tsx
useEffect(() => {
  document.body.classList.toggle('dark', isDarkMode);
}, [isDarkMode]);

// Ionic automatically applies dark mode styles
// Define colors in app/ionic-theme.css
```

### 6. Navigation Components

#### Navbar/Header
**Before**:
```tsx
<nav className="border-b">
  <div className="container">
    <Link href="/dashboard">Dashboard</Link>
  </div>
</nav>
```

**After**:
```tsx
import { IonHeader, IonToolbar, IonButtons, IonButton } from '@ionic/react';

<IonHeader>
  <IonToolbar>
    <IonButtons slot="start">
      <IonButton onClick={() => history.push('/dashboard')}>
        Dashboard
      </IonButton>
    </IonButtons>
  </IonToolbar>
</IonHeader>
```

#### Mobile Menu
**Before (manual toggle)**:
```tsx
const [isOpen, setIsOpen] = useState(false);

{isMobile && isOpen && (
  <div>Menu items</div>
)}
```

**After (IonMenu)**:
```tsx
import { IonMenu, IonContent, IonList, IonItem } from '@ionic/react';

<IonMenu contentId="main-content" type="overlay">
  <IonContent>
    <IonList>
      <IonItem button>Menu Item</IonItem>
    </IonList>
  </IonContent>
</IonMenu>
```

## File Changes Summary

### New Files Created
1. `components/AppShell.tsx` - Main Ionic app wrapper
2. `app/ionic-theme.css` - Ionic CSS variables
3. `pages/SignInPage.tsx` - Ionic signin page
4. `pages/DashboardPage.tsx` - Ionic dashboard page
5. `capacitor.config.json` - Capacitor configuration
6. `android/` - Android native project
7. `ios/` - iOS native project

### Modified Files
1. `package.json` - Updated dependencies
2. `next.config.ts` - Added static export config
3. `app/layout.tsx` - Integrated Ionic
4. `app/globals.css` - Added Ionic theme integration
5. `components/navbar.tsx` - Converted to Ionic components
6. `components/theme-toggle.tsx` - Converted to Ionic button

### Removed Dependencies
- All `@radix-ui/*` packages
- `class-variance-authority`
- `cmdk`
- `embla-carousel-react`
- `input-otp`
- `lucide-react`
- `next-themes`
- `react-day-picker`
- `react-resizable-panels`
- `vaul`

### Added Dependencies
- `@capacitor/core`
- `@capacitor/android`
- `@capacitor/ios`
- `@capacitor/cli`
- `@ionic/react`
- `@ionic/react-router`
- `ionicons`
- `react-router-dom` v5

## Styling Changes

### Tailwind Still Available
All Tailwind utility classes still work:
```tsx
<div className="flex items-center gap-4 p-6">
  <IonButton className="mt-4">Button</IonButton>
</div>
```

### Ionic CSS Variables
Use Ionic's color system:
```tsx
// Use color prop
<IonButton color="primary">Primary</IonButton>
<IonButton color="danger">Delete</IonButton>

// Or use CSS variables
<div style={{ color: 'var(--ion-color-primary)' }}>Text</div>
```

### Dark Mode Classes
```css
/* Light mode */
.light-only { display: block; }
body.dark .light-only { display: none; }

/* Dark mode */
.dark-only { display: none; }
body.dark .dark-only { display: block; }
```

## Build Process Changes

### Development
```bash
# Before
npm run dev

# After (same)
npm run dev
```

### Production Build
```bash
# Before
npm run build
npm run start

# After
npm run build        # Creates static export in 'out/'
npm run cap:sync     # Syncs to native platforms
npm run cap:open:android  # Open in Android Studio
npm run cap:open:ios      # Open in Xcode
```

## Testing Checklist

- [ ] Dark mode toggle works
- [ ] Navigation between pages works
- [ ] Forms submit correctly
- [ ] Mobile menu opens/closes
- [ ] Responsive layout on different screen sizes
- [ ] Static export builds successfully (`npm run build`)
- [ ] App runs on Android emulator
- [ ] App runs on iOS simulator
- [ ] Theme persists after page refresh
- [ ] All icons display correctly

## Common Issues & Solutions

### Issue: React Router v6 vs v5
**Problem**: Ionic React Router requires React Router v5  
**Solution**: Use `react-router-dom@^5.3.4` and `useHistory()` instead of `useNavigate()`

### Issue: IonPage not wrapping content
**Problem**: Content not scrolling or layout issues  
**Solution**: Always wrap page content in `<IonPage><IonContent>...</IonContent></IonPage>`

### Issue: Dark mode not applying
**Problem**: Ionic theme colors not changing  
**Solution**: Ensure `body.classList.toggle('dark', isDarkMode)` is called and `ionic-theme.css` is imported

### Issue: Build fails with missing 'out' directory
**Problem**: Capacitor can't find the built web app  
**Solution**: Run `npm run build` before `cap sync`

### Issue: Components look different on iOS vs Android
**Problem**: Material Design vs iOS styling  
**Solution**: This is expected! Ionic adapts to platform. Use `mode` prop to force a specific style:
```tsx
<IonButton mode="ios">iOS Style</IonButton>
<IonButton mode="md">Material Design</IonButton>
```

## Performance Considerations

1. **Lazy Loading**: Consider lazy loading route components for better performance
2. **Image Optimization**: Use Next.js Image component alternatives or optimize manually
3. **Bundle Size**: Ionic React adds ~200KB to bundle, but provides native-like UI
4. **Rendering**: All rendering is client-side in static export mode

## Next Steps for Developers

1. **Familiarize with Ionic docs**: https://ionicframework.com/docs/react
2. **Explore Capacitor plugins**: https://capacitorjs.com/docs/plugins
3. **Test on real devices**: Use Android Studio / Xcode to deploy
4. **Customize theme**: Edit `ionic-theme.css` for brand colors
5. **Add native features**: Camera, Geolocation, Push Notifications, etc.

## Resources

- [Ionic React Docs](https://ionicframework.com/docs/react)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Ionicons](https://ionic.io/ionicons)
- [React Router v5 Docs](https://v5.reactrouter.com/)
- [Next.js Static Export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
