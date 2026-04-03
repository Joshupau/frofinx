'use client'

import { useState, useEffect } from 'react'
import { X, CircleCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bill } from '@/types/bill'
import { useSettingsStore } from '@/store/settings-store'
import { formatMoney } from '@/utils/formatter'

interface MarkPaidDialogProps {
  open: boolean
  bill: Bill | null
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string, paidDate: string, absenceDeduction?: number) => void
  isProcessing?: boolean
}

export function MarkPaidDialog({ open, bill, onOpenChange, onConfirm, isProcessing }: MarkPaidDialogProps) {
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0])
  const [absenceDeduction, setAbsenceDeduction] = useState<number | undefined>(undefined)
  const { currency, hideAmountsOnOpen } = useSettingsStore()

  useEffect(() => {
    if (open && bill) {
      setPaidDate(new Date().toISOString().split('T')[0])
      setAbsenceDeduction(bill.absenceDeduction)
    }
  }, [open, bill])

  if (!open || !bill) return null

  const isIncome = bill.type === 'income'
  const actionLabel = isIncome ? 'Mark as Received' : 'Mark as Paid'
  const dateLabel = isIncome ? 'Date Received' : 'Date Paid'

  const handleClose = () => onOpenChange(false)

  const handleConfirm = () => {
    if (!paidDate) return
    onConfirm(bill.id, paidDate, absenceDeduction)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success/15 rounded-full ring-4 ring-success/10">
              <CircleCheck className="w-6 h-6 text-success" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{actionLabel}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Pick the date this was {isIncome ? 'received' : 'paid'}.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Bill summary */}
          <div className="bg-secondary/20 border border-border/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Name</span>
              <span className="font-semibold text-foreground truncate max-w-[200px]">{bill.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-foreground">{formatMoney(bill.amount, currency, hideAmountsOnOpen)}</span>
            </div>
            {bill.absenceDeduction != null && bill.absenceDeduction > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Absence Deduction</span>
                <span className="font-semibold text-warning">{formatMoney(bill.absenceDeduction, currency, hideAmountsOnOpen)}</span>
              </div>
            )}
          </div>

          {/* Date picker */}
          <div className="space-y-2">
            <label htmlFor="paidDate" className="text-sm font-semibold text-foreground">
              {dateLabel} <span className="text-destructive">*</span>
            </label>
            <Input
              id="paidDate"
              type="date"
              value={paidDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setPaidDate(e.target.value)}
              className="bg-secondary/30"
            />
            <p className="text-xs text-muted-foreground">
              Defaults to today. Change this if you paid earlier and are registering it now.
            </p>
          </div>

          {/* Absence Deduction */}
          <div className="space-y-2">
            <label htmlFor="deductionAmount" className="text-sm font-semibold text-foreground">
              Absence Deduction <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">{currency}</span>
              <Input
                id="deductionAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={absenceDeduction ?? ''}
                onChange={(e) => setAbsenceDeduction(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                className="pl-8 bg-secondary/30"
              />
            </div>
            <p className="text-xs text-muted-foreground">Update or add absence deduction for this period if applicable.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-secondary/10">
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || !paidDate}
            className="gap-2 min-w-[130px] shadow-lg shadow-primary/20"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <span>{actionLabel}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
