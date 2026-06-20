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
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_NAME, ROLES } from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Catálogos',
    icon: FileText,
    roles: [ROLES.ADMIN, ROLES.COORDINADOR],
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

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  coordinador: 'Coordinador',
  supervisor: 'Supervisor',
  tecnico: 'Técnico',
}

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  function isActive(href: string) {
    return pathname.startsWith(href)
  }

  function getInitials() {
    if (!user) return '?'
    return user.nombre_completo
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center border-b px-6 font-semibold text-sm">
        {APP_NAME}
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          if ('children' in item && item.children) {
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
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.nombre_completo ?? 'Usuario'}
            </p>
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
              {roleLabels[user?.rol ?? ''] ?? 'Sin rol'}
            </Badge>
          </div>
          <button
            onClick={logout}
            className="text-muted-foreground/60 hover:text-foreground transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
