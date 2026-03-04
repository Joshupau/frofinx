"use client"

import { useState } from 'react'
import { useHistory, useLocation, Link } from 'react-router-dom'
import {
  Moon,
  Sun,
  Search,
  Bell,
  User,
  LogOut,
  Settings as SettingsIcon,
  Wallet,
  CreditCard,
  TrendingUp,
  PieChart,
  Tag,
  Menu,
  X,
  Home,
} from 'lucide-react'
import { useThemeStore } from '@/store/theme-store'

const navItems = [
  { label: 'DASHBOARD', href: '/dashboard', icon: <Home className="w-4 h-4" /> },
  { label: 'WALLETS', href: '/wallets', icon: <Wallet className="w-4 h-4" /> },
  { label: 'TRANSACTIONS', href: '/transactions', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'BILLS', href: '/bills', icon: <CreditCard className="w-4 h-4" /> },
  { label: 'BUDGETS', href: '/budgets', icon: <PieChart className="w-4 h-4" /> },
  { label: 'CATEGORIES', href: '/categories', icon: <Tag className="w-4 h-4" /> },
  { label: 'SETTINGS', href: '/settings', icon: <SettingsIcon className="w-4 h-4" /> },
]

export default function DNavbar() {
  const history = useHistory()
  const location = useLocation()
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/')

  const go = (href: string) => {
    // Close mobile menu
    setShowMobileMenu(false)
    // Close user menu
    setShowUserMenu(false)
    // Navigate
    history.push(href)
    // Ensure scroll to top
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo / brand */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
              onClick={() => setShowMobileMenu((v) => !v)}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-card flex items-center justify-center">
              <img src="/FroFinXLogoTrans1.png" alt="FroFinX logo" className="w-full h-full object-contain" />
            </div>
            <span className="hidden sm:inline text-lg font-bold text-foreground">FroFinX</span>
          </div>

          {/* Divider to anchor brand from nav */}
          <div className="hidden lg:block h-8 w-px bg-border/70" aria-hidden="true" />
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${
                        active 
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary '
                      }
                    `}
                      title={item.label}
                      >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            })}
            
        </nav>
          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center bg-secondary rounded-md px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary transition-all">
              {/* <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-0 outline-none px-2 py-0 text-sm text-foreground placeholder:text-muted-foreground w-32 focus:placeholder-foreground"
              /> */}
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground relative" title="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-md transition-all text-sm"
                title="User menu"
              >
                U
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50 divide-y divide-border">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">User Account</p>
                    <p className="text-xs text-muted-foreground">user@example.com</p>
                  </div>
                  <div className="py-2">
                    <button onClick={() => go('/settings')} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors flex items-center gap-3">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button onClick={() => go('/settings')} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors flex items-center gap-3">
                      <SettingsIcon className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                  <button onClick={() => go('/signin')} className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors flex items-center gap-3">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <nav className="lg:hidden pb-4 border-t border-border pt-2 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => go(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

