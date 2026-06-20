'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const statusConfig: Record<string, { label: string; className: string }> = {
  disponible: { label: 'Disponible', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  asignado: { label: 'Asignado', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  en_mantenimiento: { label: 'En Mantenimiento', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  en_calibracion: { label: 'En Calibración', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  baja: { label: 'Baja', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  vacaciones: { label: 'Vacaciones', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  incapacidad: { label: 'Incapacidad', className: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' },
  borrador: { label: 'Borrador', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  programada: { label: 'Programada', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  en_curso: { label: 'En Curso', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  completada: { label: 'Completada', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  cancelada: { label: 'Cancelada', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  }

  return (
    <Badge variant="outline" className={cn(config.className, 'font-medium', className)}>
      {config.label}
    </Badge>
  )
}
