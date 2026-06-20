'use client'

import { useAuthStore } from '@/stores/auth-store'
import type { PerfilUsuario } from '@/types/database.types'

interface RoleGateProps {
  children: React.ReactNode
  roles: PerfilUsuario['rol'][]
  fallback?: React.ReactNode
}

export function RoleGate({ children, roles, fallback = null }: RoleGateProps) {
  const { user } = useAuthStore()

  if (!user) return null
  if (!roles.includes(user.rol)) return <>{fallback}</>

  return <>{children}</>
}
