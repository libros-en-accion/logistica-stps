'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { CalendarFilters } from '@/components/calendario/CalendarFilters'
import { EventDetailPanel } from '@/components/calendario/EventDetailPanel'
import { toast } from 'sonner'

const CalendarView = dynamic(
  () => import('@/components/calendario/CalendarView').then((m) => m.CalendarView),
  {
    loading: () => <div className="h-96 rounded-lg border bg-muted/20 animate-pulse" />,
    ssr: false,
  }
)

interface PanelEvent {
  id: string
  title: string
  start: string
  end: string
  color: string
  textColor: string
  extendedProps: {
    tipo: 'orden' | 'bloqueo_tecnico' | 'bloqueo_vehiculo' | 'bloqueo_equipo'
    folio?: string
    estado?: string
    recurso?: string
    descripcion?: string
  }
}

export default function CalendarioPage() {
  const [selectedEvent, setSelectedEvent] = useState<PanelEvent | null>(null)
  const router = useRouter()

  function handleEventClick(event: PanelEvent) {
    setSelectedEvent(event)
  }

  function handleDateSelect(start: Date, end: Date) {
    const params = new URLSearchParams({
      fechaInicio: start.toISOString(),
      fechaFin: end.toISOString(),
    })
    router.push(`/ordenes-servicio/nueva?${params.toString()}`)
  }

  function handleEventDrop(eventId: string, newStart: Date, newEnd: Date) {
    const ordenId = eventId.startsWith('os-') ? eventId.replace('os-', '') : null
    if (!ordenId) {
      toast.error('Solo se pueden re-programar órdenes de servicio')
      return
    }

    toast.success('Orden re-programada', {
      description: `${newStart.toLocaleDateString('es-MX')} - ${newEnd.toLocaleDateString('es-MX')}`,
    })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
        <p className="text-muted-foreground">Vista interactiva de órdenes y bloqueos</p>
      </div>

      <div className="flex gap-6">
        <div className="w-48 shrink-0">
          <CalendarFilters />
        </div>
        <div className="flex-1 min-w-0">
          <CalendarView
            onEventClick={handleEventClick}
            onDateSelect={handleDateSelect}
            onEventDrop={handleEventDrop}
          />
        </div>
      </div>

      <EventDetailPanel
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  )
}
