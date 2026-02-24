'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react'

const features = [
  { title: 'Enterprise Security', description: '256-bit SSL encryption and bank-level protocols protect your data', icon: Shield },
  { title: 'Real-time Updates', description: 'Instant syncing keeps every balance and transfer up to date', icon: Zap },
  { title: 'Advanced Analytics', description: 'Understand the full picture with curated insights and reports', icon: BarChart3 },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <div className="h-10 w-10 rounded-full text-white flex items-center justify-center"><Image src="/FroFinXLogoTrans.png" alt="FroFinX logo" width={40} height={40} className="w-full h-full object-contain" /></div>
            FroFinX
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/signin" className="text-slate-600 hover:text-slate-900">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-blue-600 px-4 py-1.5 text-blue-600 transition hover:bg-blue-50"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>

      <div className="relative overflow-visible min-h-screen px-4 py-16 sm:px-6 flex items-center">
        <div className="pointer-events-none absolute -top-10 left-4 h-56 w-56 rounded-full bg-blue-200 blur-3xl" />
        <div className="pointer-events-none absolute right-4 top-20 h-64 w-64 rounded-full bg-cyan-200 blur-3xl" />

        <div className="relative mx-auto max-w-3xl space-y-2 text-center">
            <Image src="/FroFinXLogoTrans.png" alt="FroFinX logo" width={160} height={160} className="mx-auto" />
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">FroFinX</p>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            Financial Management Made{' '}
            <span className="text-blue-600">Simple</span>
          </h1>
          <p className="text-lg text-slate-500">
            FroFinX is your complete financial dashboard. Track transactions, manage investments, and monitor your wealth with
            enterprise-grade security.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-white shadow-lg shadow-blue-200 transition hover:opacity-90"
            >
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-full border border-blue-600 px-8 py-3 text-blue-600 transition hover:bg-blue-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-center text-2xl font-semibold text-slate-900">Why Choose FroFinX?</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map(feature => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Ready to take control?</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">Join thousands of people trusting FroFinX with their finances</h2>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-white shadow-lg shadow-blue-200 transition hover:opacity-90"
          >
            Create Your Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 px-4 py-8">
        <p className="text-center text-sm text-slate-500">© 2026 FroFinX. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  const Icon = feature.icon
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <Icon className="mb-4 h-8 w-8 text-blue-600" />
      <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
      <p className="mt-3 text-sm text-slate-500">{feature.description}</p>
    </div>
  )
}
