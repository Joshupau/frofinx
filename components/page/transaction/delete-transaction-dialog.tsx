'use client'

import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import { TransactionItem } from './transaction-list'

interface DeleteTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  transaction: TransactionItem | null
  isDeleting?: boolean
}

export function DeleteTransactionDialog({
  open,
  onOpenChange,
  onConfirm,
  transaction,
  isDeleting,
}: DeleteTransactionDialogProps) {
  const handleClose = () => onOpenChange(false)

  if (!open || !transaction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-md">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-destructive/15 p-3 text-destructive ring-4 ring-destructive/10">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">Delete Transaction?</h2>
            <p className="text-sm text-muted-foreground">
              This will permanently remove the transaction from your ledger.
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Title</span>
            <span className="max-w-[220px] truncate font-semibold text-foreground">{transaction.title}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-semibold text-foreground">{transaction.amount}</span>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting} className="gap-2">
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Delete Transaction</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
