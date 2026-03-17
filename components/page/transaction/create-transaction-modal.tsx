'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateTransaction, useTransactionTags } from '@/queries/user/transaction/transaction'
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
    tags: [],
  })
  const [newTag, setNewTag] = useState('')
  const [includeServiceFee, setIncludeServiceFee] = useState(false)
  const [serviceFee, setServiceFee] = useState(0)


  const { mutate: createTransaction, isPending } = useCreateTransaction()
  const { data: walletsResponse } = useListWallets()
  const { data: categoriesResponse } = useListCategories()
  const { data: tagsResponse } = useTransactionTags()

  // Extract available tags
  let availableTags: string[] = []
  if (tagsResponse) {
    if (Array.isArray(tagsResponse)) {
      availableTags = tagsResponse
    } else if (Array.isArray((tagsResponse as any).tags)) {
      availableTags = (tagsResponse as any).tags
    } else if (Array.isArray((tagsResponse as any).data?.tags)) {
      availableTags = (tagsResponse as any).data.tags
    }
  }

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

  const toggleTag = (tag: string) => {
    setFormData(prev => {
      const current = prev.tags || []
      const exists = current.includes(tag)
      return {
        ...prev,
        tags: exists ? current.filter(t => t !== tag) : [...current, tag]
      }
    })
  }

  const addNewTag = () => {
    if (newTag.trim() && !(formData.tags || []).includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }))
      setNewTag('')
    }
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

    // Prepare submission data with service fee if included
    const submissionData = {
      ...formData,
      tags: formData.tags || [],
      ...(includeServiceFee && serviceFee > 0 && { serviceFee }),
    } as CreateTransactionData

    createTransaction(submissionData, {
      onSuccess: () => {
        toast.success('Transaction created successfully!')
        setFormData({
          type: 'expense',
          amount: 0,
          description: '',
          tags: [],
        })
        setIncludeServiceFee(false)
        setServiceFee(0)
        setNewTag('')
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
          {/* Wallet + Type Row */}
          <div className="grid grid-cols-2 gap-3">
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
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
              >
                <option value="">Select a wallet</option>
                {wallets.map((wallet: any) => (
                  <option key={wallet._id || wallet.id} value={wallet._id || wallet.id}>
                    {wallet.name}
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
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
          </div>

          {/* Category + Amount Row */}
          <div className={`grid gap-3 ${formData.type === 'transfer' ? 'grid-cols-1' : 'grid-cols-2'}`}>
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
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
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
                className="w-full text-sm"
              />
            </div>
          </div>

          {/* Date + Service Fee Row */}
          <div className="grid grid-cols-2 gap-3">
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
                className="w-full text-sm"
              />
            </div>

            {/* Service Fee Checkbox */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Service Fee
              </label>
              <input
                type="checkbox"
                id="includeServiceFee"
                checked={includeServiceFee}
                onChange={(e) => setIncludeServiceFee(e.target.checked)}
                className="w-4 h-4 rounded border border-border bg-input cursor-pointer accent-primary mt-2"
              />
            </div>
          </div>

          {/* Service Fee Amount (if enabled) */}
          {includeServiceFee && (
            <div className="space-y-2 bg-secondary/30 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="serviceFee" className="text-xs font-medium text-foreground block mb-1">
                    Fee Amount
                  </label>
                  <Input
                    id="serviceFee"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={serviceFee || ''}
                    onChange={(e) => setServiceFee(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Total</p>
                  <div className="px-3 py-2 rounded-lg bg-background border border-border text-sm font-semibold text-foreground">
                    {((formData.amount || 0) + serviceFee).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
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
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-sm"
              rows={2}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">
              Tags
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {(formData.tags || []).map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 hover:bg-primary/80 transition-colors"
                >
                  {tag}
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      (formData.tags || []).includes(tag)
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add new tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNewTag())}
                className="flex-1 text-sm"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addNewTag}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
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
