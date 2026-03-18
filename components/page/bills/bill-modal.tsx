'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateBill, useUpdateBill } from '@/queries/user/bill/bills'
import { useListWallets } from '@/queries/user/wallet/wallets'
import { useListCategories } from '@/queries/user/category/categories'
import { CreateBillData, UpdateBillData, Bill, RecurringFrequency } from '@/types/bill'
import toast from 'react-hot-toast'

interface BillModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  bill?: Bill | null // If provided, we are in Edit mode
}

export function BillModal({ open, onClose, onSuccess, bill }: BillModalProps) {
  const isEdit = !!bill

  const [formData, setFormData] = useState<Partial<CreateBillData>>({
    name: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    isRecurring: false,
    recurringFrequency: 'monthly',
    walletId: '',
    categoryId: '',
    notes: '',
  })

  // Mutations
  const { mutate: createBill, isPending: isCreating } = useCreateBill()
  const { mutate: updateBill, isPending: isUpdating } = useUpdateBill()

  // Supporting Data
  const { data: walletsResponse } = useListWallets()
  const { data: categoriesResponse } = useListCategories({ type: 'expense' })

  const wallets = walletsResponse?.data ? 
    (Array.isArray(walletsResponse.data) ? walletsResponse.data : walletsResponse.data.items || [])
    : []
  
  const categories = categoriesResponse?.data ? 
    (Array.isArray(categoriesResponse.data) ? categoriesResponse.data : categoriesResponse.data.items || [])
    : []

  // Initialize form when bill changes (Edit mode)
  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name,
        amount: bill.amount,
        dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '',
        isRecurring: bill.isRecurring,
        recurringFrequency: bill.recurringFrequency,
        walletId: bill.walletId,
        categoryId: bill.categoryId,
        notes: bill.notes,
      })
    } else {
      setFormData({
        name: '',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        isRecurring: false,
        recurringFrequency: 'monthly',
        walletId: '',
        categoryId: '',
        notes: '',
      })
    }
  }, [bill, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim()) {
      toast.error('Bill name is required')
      return
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!formData.dueDate) {
      toast.error('Due date is required')
      return
    }

    if (isEdit && bill) {
      const updateData: UpdateBillData = {
        id: bill.id,
        ...formData,
      }
      updateBill(updateData, {
        onSuccess: () => {
          toast.success('Bill updated successfully')
          onClose()
          onSuccess?.()
        },
      })
    } else {
      createBill(formData as CreateBillData, {
        onSuccess: () => {
          toast.success('Bill created successfully')
          onClose()
          onSuccess?.()
        },
      })
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-foreground">{isEdit ? 'Edit Bill' : 'New Bill'}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isEdit ? 'Update your recurring bill details.' : 'Set up a new recurring or one-time payment.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Bill Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-foreground">
              Bill Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Netflix Subscription, Rent, Internet"
              value={formData.name}
              onChange={handleChange}
              className="bg-secondary/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-semibold text-foreground">
                Amount <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₱</span>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={handleChange}
                  className="pl-8 bg-secondary/30"
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-semibold text-foreground">
                Due Date <span className="text-destructive">*</span>
              </label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="bg-secondary/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wallet Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Payment Wallet</label>
              <Select value={formData.walletId} onValueChange={(val) => handleSelectChange('walletId', val)}>
                <SelectTrigger className="bg-secondary/30">
                  <SelectValue placeholder="Select a wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((w: any) => (
                    <SelectItem key={w._id || w.id} value={w._id || w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Category</label>
              <Select value={formData.categoryId} onValueChange={(val) => handleSelectChange('categoryId', val)}>
                <SelectTrigger className="bg-secondary/30">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c: any) => (
                    <SelectItem key={c._id || c.id} value={c._id || c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recurrence Toggle */}
          <div className="bg-secondary/20 p-4 rounded-xl space-y-4 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Recurring Bill</p>
                <p className="text-xs text-muted-foreground">Automatically create next bill after payment.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => handleSelectChange('isRecurring', String(e.target.checked) === 'true' ? 'true' : '')}
                className="w-5 h-5 rounded border border-border bg-input transition-all cursor-pointer accent-primary"
                onClick={() => {
                   setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring }))
                }}
              />
            </div>

            {formData.isRecurring && (
              <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Frequency</label>
                <Select
                  value={formData.recurringFrequency}
                  onValueChange={(val) => handleSelectChange('recurringFrequency', val)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-semibold text-foreground">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Add any additional details about this bill..."
              value={formData.notes || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-secondary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-secondary/10">
          <Button variant="outline" onClick={onClose} disabled={isCreating || isUpdating}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
            className="min-w-[120px] shadow-lg shadow-primary/20"
          >
            {isCreating || isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <span>{isEdit ? 'Update Bill' : 'Create Bill'}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
