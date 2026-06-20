'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  Truck,
  Wrench,
  FileText,
  Building2,
  Ban,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/lib/constants'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Catálogos',
    icon: FileText,
    children: [
      { href: '/catalogos/tecnicos', label: 'Técnicos', icon: Users },
      { href: '/catalogos/vehiculos', label: 'Vehículos', icon: Truck },
      { href: '/catalogos/equipos', label: 'Equipos', icon: Wrench },
      { href: '/catalogos/normas', label: 'Normas', icon: FileText },
      { href: '/catalogos/clientes', label: 'Clientes', icon: Building2 },
    ],
  },
  { href: '/ordenes-servicio', label: 'Órdenes', icon: ClipboardList },
  { href: '/calendario', label: 'Calendario', icon: Calendar },
  { href: '/bloqueos', label: 'Bloqueos', icon: Ban },
  { href: '/reportes', label: 'Reportes', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center border-b px-6 font-semibold text-sm">
        {APP_NAME}
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          if ('children' in item && item.children) {
            const open = item.children.some((c) => isActive(c.href))
            return (
              <div key={item.label}>
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </div>
                <div className="ml-2 space-y-0.5">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive(child.href)
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      )}
                    >
                      <child.icon className="h-4 w-4" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          }
          const Icon = item.icon!
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive(item.href!)
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
