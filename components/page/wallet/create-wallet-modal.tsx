'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateWallet } from '@/queries/user/wallet/wallets'
import { CreateWalletData, WalletType } from '@/types/wallet'

interface CreateWalletModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

const initialFormData: CreateWalletData = {
  name: '',
  type: 'bank',
  balance: 0,
  currency: '$',
  color: '#0066CC',
  accountNumber: '',
  description: '',
}

const walletTypes: Array<{ value: WalletType; label: string }> = [
  { value: 'bank', label: 'Bank Account' },
  { value: 'cash', label: 'Cash' },
  { value: 'ewallet', label: 'E-Wallet' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'other', label: 'Other' },
]

export function CreateWalletModal({ open, onClose, onSuccess }: CreateWalletModalProps) {
  const [formData, setFormData] = useState<CreateWalletData>(initialFormData)
  const { mutate: createWallet, isPending } = useCreateWallet()

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    if (name === 'balance') {
      setFormData((previous) => ({
        ...previous,
        balance: value === '' ? undefined : Number(value),
      }))
      return
    }

    if (name === 'type') {
      setFormData((previous) => ({
        ...previous,
        type: value as WalletType,
      }))
      return
    }

    if (
      name === 'name' ||
      name === 'currency' ||
      name === 'icon' ||
      name === 'color' ||
      name === 'description' ||
      name === 'accountNumber'
    ) {
      setFormData((previous) => ({
        ...previous,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Wallet name is required')
      return
    }

    createWallet(formData, {
      onSuccess: () => {
        toast.success('Wallet created successfully!')
        setFormData(initialFormData)
        onClose()
        onSuccess?.()
      },
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">Create New Wallet</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Wallet Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              placeholder="Main Wallet"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium text-foreground">
              Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleFieldChange}
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {walletTypes.map((walletType) => (
                <option key={walletType.value} value={walletType.value}>
                  {walletType.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="balance" className="block text-sm font-medium text-foreground">
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                name="balance"
                min="0"
                step="0.01"
                value={formData.balance ?? ''}
                onChange={handleFieldChange}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="block text-sm font-medium text-foreground">
                Currency
              </label>
              <Input
                id="currency"
                name="currency"
                value={formData.currency ?? ''}
                onChange={handleFieldChange}
                placeholder="$"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="color" className="block text-sm font-medium text-foreground">
                Color
              </label>
              <Input
                id="color"
                type="color"
                name="color"
                value={formData.color ?? '#0066CC'}
                onChange={handleFieldChange}
                className="h-10 p-1"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="icon" className="block text-sm font-medium text-foreground">
                Icon (optional)
              </label>
              <Input
                id="icon"
                name="icon"
                value={formData.icon ?? ''}
                onChange={handleFieldChange}
                placeholder="wallet"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="accountNumber" className="block text-sm font-medium text-foreground">
              Account Number
            </label>
            <Input
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber ?? ''}
              onChange={handleFieldChange}
              placeholder="1234567890"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description ?? ''}
              onChange={handleFieldChange}
              placeholder="Personal spending wallet"
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Wallet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}