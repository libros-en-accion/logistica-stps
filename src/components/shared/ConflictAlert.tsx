'use client'

import { AlertCircle, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ConflictoDetectado, Advertencia } from '@/lib/validations/tipos'

interface ConflictAlertProps {
  errores?: ConflictoDetectado[]
  advertencias?: Advertencia[]
  className?: string
  onClose?: () => void
}

const motivoLabel: Record<string, string> = {
  ocupado: 'Recurso ocupado',
  bloqueado: 'Recurso bloqueado',
  calibracion_vencida: 'Calibración vencida',
  sin_certificacion: 'Sin certificación',
  equipo_no_requerido: 'Equipo no requerido',
  calibracion_proxima: 'Calibración próxima a vencer',
  sobrecarga: 'Sobrecarga de trabajo',
  mantenimiento_proximo: 'Mantenimiento próximo',
}

export function ConflictAlert({
  errores = [],
  advertencias = [],
  className,
  onClose,
}: ConflictAlertProps) {
  if (errores.length === 0 && advertencias.length === 0) return null

  return (
    <div className={cn('space-y-2', className)}>
      {errores.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-800 dark:text-red-400">
                {errores.length} conflicto{errores.length !== 1 ? 's' : ''} bloqueante{errores.length !== 1 ? 's' : ''}
              </p>
              <ul className="mt-1 space-y-1">
                {errores.map((err, i) => (
                  <li key={i} className="text-xs text-red-700 dark:text-red-300">
                    <span className="font-medium">{err.recurso_nombre}:</span>{' '}
                    {motivoLabel[err.motivo] ?? err.motivo} — {err.detalle}
                  </li>
                ))}
              </ul>
            </div>
            {onClose && (
              <button onClick={onClose} className="shrink-0 text-red-500 hover:text-red-700">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {advertencias.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/50 dark:bg-yellow-950/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                {advertencias.length} advertencia{advertencias.length !== 1 ? 's' : ''}
              </p>
              <ul className="mt-1 space-y-1">
                {advertencias.map((adv, i) => (
                  <li key={i} className="text-xs text-yellow-700 dark:text-yellow-300">
                    <span className="font-medium">{adv.recurso_nombre}:</span>{' '}
                    {motivoLabel[adv.motivo] ?? adv.motivo} — {adv.detalle}
                  </li>
                ))}
              </ul>
            </div>
            {onClose && (
              <button onClick={onClose} className="shrink-0 text-yellow-500 hover:text-yellow-700">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
