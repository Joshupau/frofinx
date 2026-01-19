'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useThemeStore } from '@/store/theme-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const isMobile = useIsMobile()
    const { isDarkMode } = useThemeStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields')
            return
        }

        setIsLoading(true)
        
        // Simulate login process
        setTimeout(() => {
            setIsLoading(false)
            // Redirect to dashboard
            window.location.href = '/dashboard'
        }, 1000)
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            {!isMobile && (
                <div className="w-1/2 flex bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h1 className="text-3xl font-bold">FroFinX</h1>
                        </div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">
                            Secure Financial Management
                        </h2>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            Your trusted partner for intelligent financial operations. 
                            Access your account securely with enterprise-grade protection.
                        </p>
                    </div>
                    
                    <div className="space-y-6 mt-12">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Bank-Level Security</h3>
                                <p className="text-blue-100 text-sm">256-bit encryption and multi-factor authentication</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Compliance Ready</h3>
                                <p className="text-blue-100 text-sm">GDPR, SOC 2, and PCI DSS compliant</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {/* Right Side - Login Form */}
            <div className={`flex-1 flex items-center justify-center px-6 py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    {isMobile && (
                        <div className="flex items-center gap-3 mb-8 justify-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>FroFinX</h1>
                        </div>
                    )}

                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle>Welcome back</CardTitle>
                            <CardDescription>
                                Sign in to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            className="pl-10 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-1 top-1/2 transform -translate-y-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-muted-foreground">Remember me</span>
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Don't have an account?{' '}
                                    <Link
                                        href="/signup"
                                        className="font-medium text-primary hover:underline"
                                    >
                                        Create account
                                    </Link>
                                </p>
                            </div>

                            <Separator className="my-6" />

                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <Lock className="w-3 h-3" />
                                <span>Secured with 256-bit SSL encryption</span>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="text-center text-xs text-muted-foreground mt-6">
                        By signing in, you agree to our{' '}
                        <Link href="/terms" className="underline hover:text-foreground">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="underline hover:text-foreground">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}