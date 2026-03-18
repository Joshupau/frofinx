"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateBudget, useListBudgets, useBudgetSummary } from '@/queries/user/budget/budgets'
import { useListCategories } from '@/queries/user/category/categories'
import { Loader2 } from 'lucide-react'

const budgetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  alertThreshold: z.coerce.number().min(1).max(100).default(80),
})

type BudgetFormValues = z.infer<typeof budgetSchema>

export default function BudgetModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { refetch: refetchBudgets } = useListBudgets()
  const { refetch: refetchSummary } = useBudgetSummary()
  const { mutate: createBudget, isPending } = useCreateBudget()
  const { data: categoriesResponse } = useListCategories({ type: 'expense' })
  
  const categories = Array.isArray(categoriesResponse?.data) 
    ? categoriesResponse.data 
    : categoriesResponse?.data?.items || []

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: '',
      amount: 0,
      categoryId: '',
      period: 'monthly',
      alertThreshold: 80,
    },
  })

  const onSubmit = (data: BudgetFormValues) => {
    // Calculate startDate and endDate for the budget period
    const now = new Date()
    let startDate = now.toISOString()
    let endDate: string | undefined
    if (data.period === 'daily') {
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
    } else if (data.period === 'weekly') {
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString()
    } else if (data.period === 'monthly') {
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString()
    } else if (data.period === 'yearly') {
      endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString()
    }

    const payload = {
      ...data,
      startDate,
      endDate,
    }
    createBudget(payload, {
      onSuccess: () => {
        toast.success('Budget created successfully')
        refetchBudgets()
        refetchSummary()
        form.reset()
        onClose()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to create budget')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-foreground">Set New Goal</DialogTitle>
          <p className="text-sm text-muted-foreground">Define a spending limit for your categories.</p>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Goal Name</label>
            <Input 
              {...form.register('name')} 
              placeholder="e.g. Monthly Coffee, Rent..." 
              className="h-12 bg-secondary/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
            />
            {form.formState.errors.name && (
              <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trigger Limit</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₱</span>
                    <Input 
                        type="number"
                        {...form.register('amount')} 
                        className="h-12 pl-8 bg-secondary/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
                    />
                </div>
                {form.formState.errors.amount && (
                    <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.amount.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Period</label>
                <Select 
                    onValueChange={(value) => form.setValue('period', value as any)}
                    defaultValue={form.getValues('period')}
                >
                    <SelectTrigger className="h-12 bg-secondary/30 border-none rounded-xl">
                        <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
            <Select 
                onValueChange={(value) => form.setValue('categoryId', value)}
                defaultValue={form.getValues('categoryId')}
            >
                <SelectTrigger className="h-12 bg-secondary/30 border-none rounded-xl">
                    <SelectValue placeholder="Choose spending category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((cat: any) => (
                        <SelectItem key={cat.id || cat._id} value={cat.id || cat._id}>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                {cat.name}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {form.formState.errors.categoryId && (
              <p className="text-[10px] font-bold text-destructive uppercase">{form.formState.errors.categoryId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Alert Me At</label>
                <span className="text-xs font-black text-primary">{form.watch('alertThreshold')}% Usage</span>
            </div>
            <Input 
                type="range"
                min="1"
                max="100"
                {...form.register('alertThreshold')}
                className="h-2 w-full bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <DialogFooter className="pt-6">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending} className="rounded-xl h-12">
              Dismiss
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-xl h-12 min-w-[140px] font-bold shadow-lg shadow-primary/20">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Activate Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  function onOpenChange(open: boolean) {
    if (!open) onClose()
  }
}

