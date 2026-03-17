'use client'
import React, { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import CategoryModal from './category-modal'
import { useListCategories, useArchiveCategory } from '@/queries/user/category/categories'

interface CategoryViewModel {
  id: string
  name: string
  type: string
  icon?: string
  color?: string
}

interface CategoryApiItem {
  _id?: string
  id?: string
  name?: string
  type?: string
  icon?: string
  color?: string
}

const normalizeCategory = (category: CategoryApiItem, index: number): CategoryViewModel => {
  const resolvedId = category._id ?? category.id ?? `category-${index}`

  return {
    id: resolvedId,
    name: category.name || 'Untitled Category',
    type: category.type || 'expense',
    icon: category.icon,
    color: category.color,
  }
}

export default function CategoryList() {
  const [open, setOpen] = useState(false)

  const { data: categoryResponse, isLoading, refetch } = useListCategories()
  const { mutate: archiveCategory } = useArchiveCategory()

  const categories = useMemo(() => {
    const responseData = categoryResponse?.data as
      | CategoryApiItem[]
      | { items?: CategoryApiItem[]; categories?: CategoryApiItem[] }
      | undefined

    if (Array.isArray(responseData)) {
      return responseData.map((category, categoryIndex) => normalizeCategory(category, categoryIndex))
    }

    if (responseData && Array.isArray(responseData.items)) {
      return responseData.items.map((category, categoryIndex) => normalizeCategory(category, categoryIndex))
    }

    if (responseData && Array.isArray(responseData.categories)) {
      return responseData.categories.map((category, categoryIndex) => normalizeCategory(category, categoryIndex))
    }

    return []
  }, [categoryResponse])

  const handleArchive = (categoryId: string) => {
    archiveCategory(
      { id: categoryId },
      {
        onSuccess: () => {
          toast.success('Category archived')
          refetch()
        },
      }
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Categories</h2>
        <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-12 rounded-lg bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="space-y-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="p-3 bg-gradient-to-br from-card to-secondary border border-border rounded-xl flex justify-between items-center hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                {c.color && (
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                )}
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{c.type}</div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => handleArchive(c.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-card border border-border rounded text-center">
          <p className="text-muted-foreground mb-4">No categories found</p>
          <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Your First Category
          </Button>
        </div>
      )}

      <CategoryModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
