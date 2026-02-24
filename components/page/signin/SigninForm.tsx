'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Signin attempt:', formData)

    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card text-card-foreground p-8 rounded-lg border border-border shadow-lg transition-all duration-300">
        <div className="text-center mb-8 space-y-2">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-border">
              <Image src="/FroFinXLogoTrans.png" alt="FroFinX logo" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <span className="ml-2 font-bold text-xl text-foreground">FroFinX</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border border-border bg-input text-primary focus:ring-2 focus:ring-primary cursor-pointer"
              />
              <span className="ml-2 text-sm text-foreground">Remember me</span>
            </label>
            <Link href="#" className="text-sm text-accent hover:underline transition-all">
              Forgot password?
            </Link>
          </div>

          <Button
            variant="blue"
            type="submit"
            className="w-full mt-6 py-2.5 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 shadow-md hover:shadow-lg"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-center text-xs text-muted-foreground">
          <Shield className="w-4 h-4 mr-2" />
          Secured with 256-bit SSL encryption
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/signup" className="text-accent font-semibold hover:underline transition-all">
            Create account
          </Link>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        <p>
          By signing in, you agree to our{' '}
          <Link href="#" className="text-accent hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-accent hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
