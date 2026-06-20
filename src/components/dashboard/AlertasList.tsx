'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Alerta {
  tipo: 'calibracion' | 'mantenimiento'
  recurso: string
  detalle: string
  fecha: string
  url?: string
}

export function AlertasList() {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const items: Alerta[] = []

      // Equipos con calibración próxima a vencer (≤30 días)
      const hoy = new Date()
      const dentro30 = new Date()
      dentro30.setDate(dentro30.getDate() + 30)

      const { data: equipos } = await supabase
        .from('equipos_medicion')
        .select('id_interno, descripcion, vigencia_calibracion')
        .gte('vigencia_calibracion', hoy.toISOString().split('T')[0])
        .lte('vigencia_calibracion', dentro30.toISOString().split('T')[0])

      if (equipos) {
        for (const e of equipos) {
          const dias = Math.ceil(
            (new Date(e.vigencia_calibracion!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
          items.push({
            tipo: 'calibracion',
            recurso: e.id_interno,
            detalle: `Calibración vence en ${dias} días`,
            fecha: e.vigencia_calibracion!,
            url: '/catalogos/equipos',
          })
        }
      }

      // Vehículos con mantenimiento próximo (≤7 días)
      const dentro7 = new Date()
      dentro7.setDate(dentro7.getDate() + 7)

      const { data: vehiculos } = await supabase
        .from('vehiculos')
        .select('numero_unidad, prox_mantto')
        .gte('prox_mantto', hoy.toISOString().split('T')[0])
        .lte('prox_mantto', dentro7.toISOString().split('T')[0])

      if (vehiculos) {
        for (const v of vehiculos) {
          const dias = Math.ceil(
            (new Date(v.prox_mantto!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
          items.push({
            tipo: 'mantenimiento',
            recurso: v.numero_unidad,
            detalle: `Mantenimiento programado en ${dias} días`,
            fecha: v.prox_mantto!,
            url: '/catalogos/vehiculos',
          })
        }
      }

      setAlertas(items)
    }

    load()
  }, [])

  if (alertas.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Bell className="h-4 w-4" />
        Alertas ({alertas.length})
      </div>
      <div className="space-y-1.5">
        {alertas.map((alert, i) => {
          const Content = (
            <div
              key={i}
              className={cn(
                'flex items-start gap-2 rounded-md p-2 text-xs',
                alert.tipo === 'calibracion'
                  ? 'bg-purple-50 dark:bg-purple-950/20'
                  : 'bg-yellow-50 dark:bg-yellow-950/20'
              )}
            >
              <AlertTriangle className={cn(
                'h-3.5 w-3.5 mt-0.5 shrink-0',
                alert.tipo === 'calibracion' ? 'text-purple-600' : 'text-yellow-600'
              )} />
              <div>
                <p className="font-medium">{alert.recurso}</p>
                <p className="text-muted-foreground">{alert.detalle}</p>
              </div>
            </div>
          )

          if (alert.url) {
            return <Link key={i} href={alert.url}>{Content}</Link>
          }
          return Content
        })}
      </div>
    </div>
  )
}
