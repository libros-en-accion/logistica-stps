'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Actividad {
  id: string
  tipo: 'orden_creada' | 'orden_actualizada' | 'bloqueo_creado'
  descripcion: string
  fecha: string
  url: string
}

export function ActividadReciente() {
  const [actividades, setActividades] = useState<Actividad[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const items: Actividad[] = []

      // Últimas 5 órdenes creadas
      const { data: ordenes } = await supabase
        .from('ordenes_servicio')
        .select('id, folio, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (ordenes) {
        for (const o of ordenes) {
          items.push({
            id: o.id,
            tipo: 'orden_creada',
            descripcion: `Orden ${o.folio} creada`,
            fecha: o.created_at,
            url: `/ordenes-servicio/${o.id}`,
          })
        }
      }

      // Últimos 3 bloqueos
      const { data: bloqueos } = await supabase
        .from('bloqueos_recursos')
        .select('id, tipo_recurso, tipo_bloqueo, created_at')
        .order('created_at', { ascending: false })
        .limit(3)

      if (bloqueos) {
        for (const b of bloqueos) {
          items.push({
            id: b.id,
            tipo: 'bloqueo_creado',
            descripcion: `Bloqueo de ${b.tipo_recurso} (${b.tipo_bloqueo})`,
            fecha: b.created_at,
            url: '/bloqueos',
          })
        }
      }

      setActividades(items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 8))
    }

    load()
  }, [])

  if (actividades.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Actividad reciente</h3>
      <div className="space-y-1">
        {actividades.map((a) => (
          <Link
            key={`${a.tipo}-${a.id}`}
            href={a.url}
            className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-muted transition-colors"
          >
            <span>{a.descripcion}</span>
            <span className="text-muted-foreground">
              {new Date(a.fecha).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
