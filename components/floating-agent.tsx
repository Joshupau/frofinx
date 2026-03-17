'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useQuickStats } from '@/queries/user/transaction/transaction'
import { X, MessageCircle } from 'lucide-react'

export function FloatingAgent() {
  const { data: quickStatsResponse, isLoading } = useQuickStats()
  const [isOpen, setIsOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const topCategory = quickStatsResponse?.data?.topCategory || {}
  const insight = topCategory.insight

  // Don't render if no insight or hidden
  if (!insight || isHidden || isLoading) {
    return null
  }

  return (
    <>
      {/* Floating Container */}
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        {/* Expanded Chat Box */}
        <div
          className={`absolute bottom-0 right-0 transition-all duration-300 ease-out origin-bottom-right ${
            isOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-75 pointer-events-none'
          }`}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden">
            {/* Header with close button */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-4 flex justify-between items-center">
              <h3 className="text-white font-semibold">Agent Z</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Agent Image and Message */}
            <div className="p-6 space-y-4">
              <div className="flex justify-center">
                <Image
                  src="/agentz.png"
                  alt="AI Financial Advisor"
                  width={200}
                  height={220}
                  className="object-contain"
                />
              </div>

              {/* Insight Message */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed">
                  {insight}
                </p>
              </div>

              {/* Hide button */}
              <button
                onClick={() => {
                  setIsOpen(false)
                  setIsHidden(true)
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2 border border-border rounded-lg hover:bg-secondary"
              >
                Hide for now
              </button>
            </div>
          </div>
        </div>

        {/* Collapsed Button - Always visible when not hidden */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative ${
            isOpen ? 'scale-95' : 'scale-100'
          }`}
        >
          {!isOpen && (
            <>
              <Image
                src="/agentz.png"
                alt="AI Advisor"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              {/* Notification dot */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </>
          )}
          {isOpen && <MessageCircle size={24} />}
        </button>
      </div>

      {/* Show again button (appears when hidden) */}
      {isHidden && (
        <button
          onClick={() => setIsHidden(false)}
          className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 text-sm font-medium"
        >
          <MessageCircle size={16} />
          Show Insight
        </button>
      )}
    </>
  )
}
