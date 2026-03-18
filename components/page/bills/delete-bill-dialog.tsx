'use client'

import { X, AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Bill } from '@/types/bill'
import { formatCurrency, formatDate } from '@/utils/formatter'

interface DeleteBillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  billName: string
  isDeleting?: boolean
}

export function DeleteBillDialog({
  open,
  onOpenChange,
  onConfirm,
  billName,
  isDeleting,
}: DeleteBillDialogProps) {
  if (!open) return null

  const handleClose = () => onOpenChange(false)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden p-6 animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center gap-4 text-destructive mb-6">
          <div className="p-3 bg-destructive/15 rounded-full ring-4 ring-destructive/10">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Archive Bill?</h2>
            <p className="text-sm text-muted-foreground mt-0.5">This action will remove the bill from your active ledger.</p>
          </div>
        </div>

        <div className="bg-secondary/20 border border-border/50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Bill Name</span>
            <span className="font-semibold text-foreground truncate max-w-[200px]">{billName}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="gap-2 shadow-lg shadow-destructive/20"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                <span>Removing...</span>
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Archive Bill</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
