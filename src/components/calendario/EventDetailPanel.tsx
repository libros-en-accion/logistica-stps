'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface PanelEvent {
  id: string
  title: string
  start: string
  end: string
  extendedProps: {
    tipo: 'orden' | 'bloqueo_tecnico' | 'bloqueo_vehiculo' | 'bloqueo_equipo'
    folio?: string
    estado?: string
    recurso?: string
    descripcion?: string
  }
}

interface EventDetailPanelProps {
  event: PanelEvent | null
  onClose: () => void
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  const [loading, setLoading] = useState(false)
  const [tecnicos, setTecnicos] = useState<string[]>([])
  const [vehiculos, setVehiculos] = useState<string[]>([])
  const [equipos, setEquipos] = useState<string[]>([])
  const [normas, setNormas] = useState<string[]>([])

  const ordenId = event?.id.startsWith('os-') ? event.id.replace('os-', '') : null

  useEffect(() => {
    if (!ordenId) {
      setTecnicos([])
      setVehiculos([])
      setEquipos([])
      setNormas([])
      return
    }

    async function loadResources() {
      setLoading(true)
      const supabase = createClient()
      try {
        const [t, v, e, n] = await Promise.all([
          supabase.from('asignaciones_tecnicos').select('tecnicos!inner(nombre, apellidos)').eq('orden_servicio_id', ordenId),
          supabase.from('asignaciones_vehiculos').select('vehiculos!inner(numero_unidad, marca, modelo)').eq('orden_servicio_id', ordenId),
          supabase.from('asignaciones_equipos').select('equipos_medicion!inner(id_interno, descripcion)').eq('orden_servicio_id', ordenId),
          supabase.from('ordenes_normas').select('normas_stps!inner(clave)').eq('orden_servicio_id', ordenId),
        ])

        setTecnicos((t.data ?? []).map((r: any) => `${r.tecnicos.nombre} ${r.tecnicos.apellidos}`))
        setVehiculos((v.data ?? []).map((r: any) => `${r.vehiculos.numero_unidad} - ${r.vehiculos.marca} ${r.vehiculos.modelo}`))
        setEquipos((e.data ?? []).map((r: any) => `${r.equipos_medicion.id_interno} - ${r.equipos_medicion.descripcion}`))
        setNormas((n.data ?? []).map((r: any) => r.normas_stps.clave))
      } catch (err) {
        console.error('Error al cargar recursos para el panel:', err)
      } finally {
        setLoading(false)
      }
    }

    loadResources()
  }, [ordenId])

  if (!event) return null

  const tipoLabel: Record<string, string> = {
    orden: 'Orden de Servicio',
    bloqueo_tecnico: 'Bloqueo de Técnico',
    bloqueo_vehiculo: 'Bloqueo de Vehículo',
    bloqueo_equipo: 'Bloqueo de Equipo',
  }

  return (
    <div className="fixed right-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-96 border-l bg-background shadow-lg animate-in slide-in-from-right overflow-y-auto">
      <div className="flex items-center justify-between border-b p-4 sticky top-0 bg-background z-10">
        <h3 className="font-semibold text-sm">Detalle</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {tipoLabel[event.extendedProps.tipo] ?? 'Evento'}
          </p>
          <p className="text-lg font-semibold mt-1">{event.title}</p>
        </div>

        {event.extendedProps.estado && (
          <div>
            <p className="text-xs text-muted-foreground">Estado</p>
            <StatusBadge status={event.extendedProps.estado} />
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground">Inicio</p>
          <p className="text-sm">{new Date(event.start).toLocaleString('es-MX')}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Fin</p>
          <p className="text-sm">{new Date(event.end).toLocaleString('es-MX')}</p>
        </div>

        {event.extendedProps.recurso && (
          <div>
            <p className="text-xs text-muted-foreground">Recurso</p>
            <p className="text-sm">{event.extendedProps.recurso}</p>
          </div>
        )}

        {event.extendedProps.descripcion && (
          <div>
            <p className="text-xs text-muted-foreground">Descripción</p>
            <p className="text-sm">{event.extendedProps.descripcion}</p>
          </div>
        )}

        {ordenId && (
          <div className="border-t pt-4 space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Recursos Asignados</h4>
            
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="space-y-1">
                  <div className="h-3 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Técnicos</p>
                  <p className="text-sm font-medium text-foreground">{tecnicos.join(', ') || 'Sin técnicos asignados'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vehículos</p>
                  <p className="text-sm font-medium text-foreground">{vehiculos.join(', ') || 'Sin vehículos asignados'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Instrumentos</p>
                  <p className="text-sm font-medium text-foreground">{equipos.join(', ') || 'Sin instrumentos asignados'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Normas a Evaluar</p>
                  <p className="text-sm font-medium text-foreground">{normas.join(', ') || 'Sin normas'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {ordenId && (
          <div className="pt-2">
            <Link href={`/ordenes-servicio/${ordenId}`}>
              <Button className="w-full">
                <ExternalLink className="mr-1 h-4 w-4" /> Ver orden
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
