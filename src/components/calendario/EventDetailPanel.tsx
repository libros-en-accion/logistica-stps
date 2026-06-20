'use client'

import Link from 'next/link'
import { X, ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'

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
  if (!event) return null

  const ordenId = event.id.startsWith('os-') ? event.id.replace('os-', '') : null
  const tipoLabel: Record<string, string> = {
    orden: 'Orden de Servicio',
    bloqueo_tecnico: 'Bloqueo de Técnico',
    bloqueo_vehiculo: 'Bloqueo de Vehículo',
    bloqueo_equipo: 'Bloqueo de Equipo',
  }

  return (
    <div className="fixed right-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-96 border-l bg-background shadow-lg animate-in slide-in-from-right">
      <div className="flex items-center justify-between border-b p-4">
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
          <Link href={`/ordenes-servicio/${ordenId}`}>
            <Button className="w-full">
              <ExternalLink className="mr-1 h-4 w-4" /> Ver orden
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
