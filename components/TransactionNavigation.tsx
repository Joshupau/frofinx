"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export type NavLink = {
  path: string
  label: string
  children?: NavLink[]
}

const defaultLinks: NavLink[] = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/dashboard/transactions", label: "Transactions" },
  { path: "/dashboard/analytics", label: "Analytics" },
  {
    path: "/dashboard/tools",
    label: "Tools",
    children: [
      { path: "/dashboard/tools/import", label: "Import" },
      { path: "/dashboard/tools/export", label: "Export" },
    ],
  },
]

function isActivePath(pathname: string | null, link: NavLink): boolean {
  if (!pathname) return false
  if (pathname === link.path) return true
  if (pathname.startsWith(link.path + "/")) return true
  if (!link.children) return false
  return link.children.some((child) => isActivePath(pathname, child))
}

export default function TransactionNavigation({ links = defaultLinks }: { links?: NavLink[] }) {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (path: string) => {
    setOpenGroups((s) => ({ ...s, [path]: !s[path] }))
  }

  return (
    <nav aria-label="Primary" className="space-y-1">
      {links.map((link) => {
        const active = isActivePath(pathname, link)
        if (!link.children || link.children.length === 0) {
          return (
            <div key={link.path}>
              <Link href={link.path} className={`block px-3 py-2 rounded-md text-sm font-medium ${active ? 'text-orange-600' : 'text-gray-700 hover:text-gray-900'}`}>
                {link.label}
              </Link>
            </div>
          )
        }

        const open = openGroups[link.path] ?? active
        return (
          <div key={link.path}>
            <button
              onClick={() => toggleGroup(link.path)}
              aria-expanded={open}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${active ? 'text-orange-600' : 'text-gray-700 hover:text-gray-900'}`}
            >
              <span>{link.label}</span>
              <span className={`transform transition-transform ${open ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </button>
            {open && (
              <div className="pl-4 mt-1 space-y-1">
                {link.children!.map((child) => {
                  const childActive = isActivePath(pathname, child)
                  return (
                    <Link key={child.path} href={child.path} className={`block px-3 py-2 rounded-md text-sm ${childActive ? 'text-orange-600' : 'text-gray-600 hover:text-gray-800'}`}>
                      {child.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
