'use client'

import { useRef, useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es'
import type { EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core'
import { createClient } from '@/lib/supabase/client'

interface CalendarEvent {
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

const colorMap: Record<string, string> = {
  borrador: '#6b7280',
  programada: '#3b82f6',
  en_curso: '#22c55e',
  completada: '#10b981',
  cancelada: '#ef4444',
  vacaciones: '#f97316',
  incapacidad: '#ec4899',
  mantenimiento: '#f59e0b',
  calibracion: '#a855f7',
  prestamo: '#8b5cf6',
  otro: '#6b7280',
}

const textColorMap: Record<string, string> = {
  borrador: '#ffffff',
  programada: '#ffffff',
  en_curso: '#ffffff',
  completada: '#ffffff',
  cancelada: '#ffffff',
  vacaciones: '#ffffff',
  incapacidad: '#ffffff',
  mantenimiento: '#ffffff',
  calibracion: '#ffffff',
  prestamo: '#ffffff',
  otro: '#ffffff',
}

interface CalendarViewProps {
  onEventClick?: (event: CalendarEvent) => void
  onDateSelect?: (start: Date, end: Date) => void
  onEventDrop?: (eventId: string, newStart: Date, newEnd: Date, revert: () => void) => void
  filterRecursoId?: string
  refreshTrigger?: number
}

export function CalendarView({
  onEventClick,
  onDateSelect,
  onEventDrop,
  filterRecursoId,
  refreshTrigger,
}: CalendarViewProps) {
  const calendarRef = useRef<FullCalendar>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const supabase = createClient()

  async function cargarEventos() {
    const todos: CalendarEvent[] = []

    // Órdenes de servicio
    const { data: ordenes } = await supabase
      .from('ordenes_servicio')
      .select('id, folio, fecha_inicio, fecha_fin, estado, clientes!inner(razon_social)')
      .not('estado', 'eq', 'cancelada')

    if (ordenes) {
      for (const os of ordenes as any[]) {
        todos.push({
          id: `os-${os.id}`,
          title: `${os.folio} - ${os.clientes?.razon_social ?? ''}`,
          start: os.fecha_inicio,
          end: os.fecha_fin,
          color: colorMap[os.estado] ?? '#6b7280',
          textColor: '#ffffff',
          extendedProps: {
            tipo: 'orden',
            folio: os.folio,
            estado: os.estado,
          },
        })
      }
    }

    // Bloqueos de técnicos
    const { data: bloqueosTec } = await supabase
      .from('bloqueos_recursos')
      .select('*, tecnicos!inner(nombre, apellidos)')
      .eq('tipo_recurso', 'tecnico')

    if (bloqueosTec) {
      for (const b of bloqueosTec as any[]) {
        todos.push({
          id: `bloq-tec-${b.id}`,
          title: `🔒 ${b.tecnicos?.nombre ?? ''} ${b.tecnicos?.apellidos ?? ''} - ${b.tipo_bloqueo}`,
          start: b.fecha_inicio,
          end: b.fecha_fin,
          color: colorMap[b.tipo_bloqueo] ?? '#6b7280',
          textColor: '#ffffff',
          extendedProps: {
            tipo: 'bloqueo_tecnico',
            recurso: `${b.tecnicos?.nombre ?? ''} ${b.tecnicos?.apellidos ?? ''}`,
            descripcion: b.observaciones,
          },
        })
      }
    }

    // Bloqueos de vehículos
    const { data: bloqueosVeh } = await supabase
      .from('bloqueos_recursos')
      .select('*, vehiculos!inner(numero_unidad)')
      .eq('tipo_recurso', 'vehiculo')

    if (bloqueosVeh) {
      for (const b of bloqueosVeh as any[]) {
        todos.push({
          id: `bloq-veh-${b.id}`,
          title: `🔒 ${b.vehiculos?.numero_unidad ?? ''} - ${b.tipo_bloqueo}`,
          start: b.fecha_inicio,
          end: b.fecha_fin,
          color: colorMap[b.tipo_bloqueo] ?? '#6b7280',
          textColor: '#ffffff',
          extendedProps: {
            tipo: 'bloqueo_vehiculo',
            recurso: b.vehiculos?.numero_unidad,
            descripcion: b.observaciones,
          },
        })
      }
    }

    // Bloqueos de equipos
    const { data: bloqueosEq } = await supabase
      .from('bloqueos_recursos')
      .select('*, equipos_medicion!inner(id_interno, descripcion)')
      .eq('tipo_recurso', 'equipo')

    if (bloqueosEq) {
      for (const b of bloqueosEq as any[]) {
        todos.push({
          id: `bloq-eq-${b.id}`,
          title: `🔒 ${b.equipos_medicion?.id_interno ?? ''} - ${b.tipo_bloqueo}`,
          start: b.fecha_inicio,
          end: b.fecha_fin,
          color: colorMap[b.tipo_bloqueo] ?? '#6b7280',
          textColor: '#ffffff',
          extendedProps: {
            tipo: 'bloqueo_equipo',
            recurso: b.equipos_medicion?.id_interno,
            descripcion: b.observaciones,
          },
        })
      }
    }

    setEvents(todos)
  }

  useEffect(() => {
    cargarEventos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRecursoId, refreshTrigger])

  function handleEventClick(info: EventClickArg) {
    const ev = info.event
    onEventClick?.({
      id: ev.id,
      title: ev.title,
      start: ev.start?.toISOString() ?? '',
      end: ev.end?.toISOString() ?? '',
      color: ev.backgroundColor ?? '',
      textColor: ev.textColor ?? '',
      extendedProps: ev.extendedProps as any,
    })
  }

  function handleDateSelect(info: DateSelectArg) {
    onDateSelect?.(info.start, info.end)
  }

  function handleEventDrop(info: EventDropArg) {
    const eventId = info.event.id
    const newStart = info.event.start
    const newEnd = info.event.end
    if (newStart && newEnd) {
      onEventDrop?.(eventId, newStart, newEnd, () => info.revert())
    }
  }

  return (
    <div className="calendar-container bg-background rounded-lg border p-4">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          center: 'title',
          right: 'prev,today,next',
        }}
        locale={esLocale}
        events={events as any}
        eventClick={handleEventClick}
        selectable
        select={handleDateSelect}
        editable
        eventDrop={handleEventDrop}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        buttonText={{
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          list: 'Lista',
        }}
      />
    </div>
  )
}
