'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateTransaction } from '@/queries/user/transaction/transaction'
import { useListWallets } from '@/queries/user/wallet/wallets'
import { useListCategories } from '@/queries/user/category/categories'
import { CreateTransactionData } from '@/types/transaction'
import toast from 'react-hot-toast'

interface CreateTransactionModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  initialWalletId?: string
  initialType?: 'income' | 'expense' | 'transfer'
  title?: string
}

export function CreateTransactionModal({ 
  open, 
  onClose, 
  onSuccess,
  initialWalletId,
  initialType = 'expense',
  title = 'New Transaction'
}: CreateTransactionModalProps) {
  const [formData, setFormData] = useState<Partial<CreateTransactionData>>({
    type: initialType,
    walletId: initialWalletId,
    amount: 0,
    description: '',
  })

  console.log(initialWalletId, initialType)

  const { mutate: createTransaction, isPending } = useCreateTransaction()
  const { data: walletsResponse } = useListWallets()
  const { data: categoriesResponse } = useListCategories()

  // Extract wallets and categories from API responses
  const wallets = walletsResponse?.data ? 
    (Array.isArray(walletsResponse.data) ? walletsResponse.data : walletsResponse.data.items || [])
    : []
  
  const categories = categoriesResponse?.data ? 
    (Array.isArray(categoriesResponse.data) ? categoriesResponse.data : categoriesResponse.data.items || [])
    : []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.walletId) {
      toast.error('Please select a wallet')
      return
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!formData.description?.trim()) {
      toast.error('Please enter a description')
      return
    }

    createTransaction(formData as CreateTransactionData, {
      onSuccess: () => {
        toast.success('Transaction created successfully!')
        setFormData({
          type: 'expense',
          amount: 0,
          description: '',
        })
        onClose()
        onSuccess?.()
      },
      onError: (error) => {
        console.error('Error creating transaction:', error)
      },
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Wallet Selection */}
          <div className="space-y-2">
            <label htmlFor="walletId" className="text-sm font-medium text-foreground block">
              Wallet *
            </label>
            <select
              id="walletId"
              name="walletId"
              value={formData.walletId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="">Select a wallet</option>
              {wallets.map((wallet: any) => (
                <option key={wallet._id || wallet.id} value={wallet._id || wallet.id}>
                  {wallet.name} ({wallet.currency || 'USD'})
                </option>
              ))}
            </select>
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium text-foreground block">
              Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type || 'expense'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          {/* Category Selection */}
          {formData.type !== 'transfer' && (
            <div className="space-y-2">
              <label htmlFor="categoryId" className="text-sm font-medium text-foreground block">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">Select a category</option>
                {categories.map((category: any) => (
                  <option key={category._id || category.id} value={category._id || category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-foreground block">
              Amount *
            </label>
            <Input
              id="amount"
              type="number"
              name="amount"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.amount || ''}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground block">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter transaction details..."
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              rows={3}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-foreground block">
              Date
            </label>
            <Input
              id="date"
              type="date"
              name="date"
              value={formData.date || ''}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* To Wallet (for transfers) */}
          {formData.type === 'transfer' && (
            <div className="space-y-2">
              <label htmlFor="toWalletId" className="text-sm font-medium text-foreground block">
                Transfer to *
              </label>
              <select
                id="toWalletId"
                name="toWalletId"
                value={formData.toWalletId || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">Select destination wallet</option>
                {wallets.map((wallet: any) => (
                  wallet._id !== formData.walletId && (
                    <option key={wallet._id || wallet.id} value={wallet._id || wallet.id}>
                      {wallet.name}
                    </option>
                  )
                ))}
              </select>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="gap-2"
            onClick={handleSubmit}
          >
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  )
}
