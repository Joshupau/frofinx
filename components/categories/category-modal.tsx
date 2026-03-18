"use client"
import React, { useState } from 'react'
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
import { useCreateCategory, useListCategories } from '@/queries/user/category/categories'
import { Loader2 } from 'lucide-react'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['income', 'expense']),
  color: z.string().optional(),
  icon: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export default function CategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { refetch } = useListCategories()
  const { mutate: createCategory, isPending } = useCreateCategory()
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'expense',
      color: '#6366f1',
      icon: '📂',
    },
  })

  const onSubmit = (data: CategoryFormValues) => {
    createCategory(data, {
      onSuccess: () => {
        toast.success('Category created successfully')
        refetch()
        form.reset()
        onClose()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to create category')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input 
              {...form.register('name')} 
              placeholder="e.g. Groceries, Salary..." 
              className="bg-secondary/30"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select 
              onValueChange={(value) => form.setValue('type', value as 'income' | 'expense')}
              defaultValue={form.getValues('type')}
            >
              <SelectTrigger className="bg-secondary/30 w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium focus:outline-none">Color</label>
              <div className="flex items-center gap-2">
                <Input 
                  type="color" 
                  {...form.register('color')} 
                  className="h-10 w-full p-1 bg-secondary/30 border-none cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Icon (Emoji)</label>
              <Input 
                {...form.register('icon')} 
                placeholder="📂" 
                className="bg-secondary/30"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-[100px]">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

