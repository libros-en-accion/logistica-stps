'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { CalendarFilters } from '@/components/calendario/CalendarFilters'
import { EventDetailPanel } from '@/components/calendario/EventDetailPanel'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { validarOrdenServicio } from '@/lib/validations/motor-validacion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle2, Calendar, Clock } from 'lucide-react'

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

interface RescheduleState {
  ordenId: string
  folio: string
  newStart: Date
  newEnd: Date
  revert: () => void
  errores: any[]
  advertencias: any[]
}

export default function CalendarioPage() {
  const [selectedEvent, setSelectedEvent] = useState<PanelEvent | null>(null)
  const [rescheduleState, setRescheduleState] = useState<RescheduleState | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [loadingReschedule, setLoadingReschedule] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
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

  async function handleEventDrop(
    eventId: string,
    newStart: Date,
    newEnd: Date,
    revert: () => void
  ) {
    const ordenId = eventId.startsWith('os-') ? eventId.replace('os-', '') : null
    if (!ordenId) {
      toast.error('Solo se pueden re-programar órdenes de servicio')
      revert()
      return
    }

    const toastId = toast.loading('Validando disponibilidad de recursos...')

    try {
      const supabase = createClient()

      // 1. Obtener la orden de servicio para saber su folio y cliente_id
      const { data: orden, error: ordenError } = await supabase
        .from('ordenes_servicio')
        .select('folio, fecha_inicio, fecha_fin, cliente_id')
        .eq('id', ordenId)
        .single()

      if (ordenError || !orden) {
        throw new Error('No se pudo cargar la información de la orden')
      }

      // 2. Obtener los recursos asignados actualmente
      const [t, v, e, n] = await Promise.all([
        supabase.from('asignaciones_tecnicos').select('tecnico_id').eq('orden_servicio_id', ordenId),
        supabase.from('asignaciones_vehiculos').select('vehiculo_id').eq('orden_servicio_id', ordenId),
        supabase.from('asignaciones_equipos').select('equipo_id').eq('orden_servicio_id', ordenId),
        supabase.from('ordenes_normas').select('norma_id').eq('orden_servicio_id', ordenId),
      ])

      const tecnicosIds = (t.data ?? []).map((r) => r.tecnico_id)
      const vehiculosIds = (v.data ?? []).map((r) => r.vehiculo_id)
      const equiposIds = (e.data ?? []).map((r) => r.equipo_id)
      const normasIds = (n.data ?? []).map((r) => r.norma_id)

      // 3. Ejecutar el motor de validaciones
      const valResult = await validarOrdenServicio({
        ordenId,
        fechaInicio: newStart,
        fechaFin: newEnd,
        clienteId: orden.cliente_id,
        tecnicosIds,
        vehiculosIds,
        equiposIds,
        normasIds,
      })

      toast.dismiss(toastId)

      setRescheduleState({
        ordenId,
        folio: orden.folio,
        newStart,
        newEnd,
        revert,
        errores: valResult.errores,
        advertencias: valResult.advertencias,
      })
      setConfirmDialogOpen(true)
    } catch (err: any) {
      toast.dismiss(toastId)
      toast.error(err.message || 'Error al validar la reprogramación')
      revert()
    }
  }

  async function handleConfirmReschedule(options: {
    keepResources: boolean
    removeConflicting: boolean
  }) {
    if (!rescheduleState) return

    setLoadingReschedule(true)
    const { ordenId, newStart, newEnd, errores, revert } = rescheduleState
    const supabase = createClient()

    try {
      // Si se elige desasignar los recursos en conflicto
      if (options.removeConflicting && errores.length > 0) {
        for (const err of errores) {
          if (err.tipo === 'tecnico') {
            await supabase
              .from('asignaciones_tecnicos')
              .delete()
              .eq('orden_servicio_id', ordenId)
              .eq('tecnico_id', err.recurso_id)
          } else if (err.tipo === 'vehiculo') {
            await supabase
              .from('asignaciones_vehiculos')
              .delete()
              .eq('orden_servicio_id', ordenId)
              .eq('vehiculo_id', err.recurso_id)
          } else if (err.tipo === 'equipo') {
            await supabase
              .from('asignaciones_equipos')
              .delete()
              .eq('orden_servicio_id', ordenId)
              .eq('equipo_id', err.recurso_id)
          }
        }
      }

      // Actualizar la fecha en la orden de servicio
      const { error } = await supabase
        .from('ordenes_servicio')
        .update({
          fecha_inicio: newStart.toISOString(),
          fecha_fin: newEnd.toISOString(),
        })
        .eq('id', ordenId)

      if (error) throw error

      toast.success('Orden reprogramada correctamente')
      setConfirmDialogOpen(false)
      setRescheduleState(null)
      setRefreshTrigger((prev) => prev + 1)
      router.refresh()
    } catch (err: any) {
      toast.error(`Error al guardar cambios: ${err.message || 'Error desconocido'}`)
      revert()
    } finally {
      setLoadingReschedule(false)
    }
  }

  function handleCancelReschedule() {
    if (rescheduleState) {
      rescheduleState.revert()
      setRescheduleState(null)
    }
    setConfirmDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
        <p className="text-muted-foreground">Vista interactiva de órdenes y bloqueos</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-48 shrink-0">
          <CalendarFilters />
        </div>
        <div className="flex-1 min-w-0">
          <CalendarView
            onEventClick={handleEventClick}
            onDateSelect={handleDateSelect}
            onEventDrop={handleEventDrop}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>

      <EventDetailPanel
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Modal de Confirmación / Conflictos de Reprogramación */}
      <Dialog open={confirmDialogOpen} onOpenChange={(open) => !open && handleCancelReschedule()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              {rescheduleState && rescheduleState.errores.length > 0 ? (
                <>
                  <AlertTriangle className="h-6 w-6 text-destructive animate-bounce" />
                  Conflictos Detectados
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  Confirmar Reprogramación
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              Se solicita mover la orden de servicio{' '}
              <span className="font-bold text-foreground">{rescheduleState?.folio}</span> a la siguiente fecha:
            </DialogDescription>
          </DialogHeader>

          {rescheduleState && (
            <div className="space-y-4 my-2">
              {/* Resumen del Rango */}
              <div className="p-3 bg-muted/50 rounded-lg border flex flex-col gap-2">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    {rescheduleState.newStart.toLocaleDateString('es-MX', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>
                    De {rescheduleState.newStart.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} a{' '}
                    {rescheduleState.newEnd.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Advertencias (Warnings) */}
              {rescheduleState.advertencias.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg text-amber-800 dark:text-amber-300 text-xs space-y-1">
                  <div className="font-semibold flex items-center gap-1 mb-1 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Advertencias de sobrecarga/mantenimiento:
                  </div>
                  <ul className="list-disc pl-4 space-y-1">
                    {rescheduleState.advertencias.map((adv: any, i: number) => (
                      <li key={i}>{adv.detalle}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Errores (Conflicts) */}
              {rescheduleState.errores.length > 0 ? (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs space-y-1">
                  <div className="font-semibold flex items-center gap-1 mb-1 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    No es posible re-programar con los recursos actuales:
                  </div>
                  <ul className="list-disc pl-4 space-y-1">
                    {rescheduleState.errores.map((err: any, i: number) => (
                      <li key={i} className="font-medium">{err.detalle}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Todos los recursos asignados están disponibles en este horario.
                </p>
              )}
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={handleCancelReschedule} disabled={loadingReschedule}>
              Cancelar
            </Button>

            {rescheduleState && rescheduleState.errores.length > 0 ? (
              <>
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleConfirmReschedule({ keepResources: false, removeConflicting: true })}
                  disabled={loadingReschedule}
                >
                  Desasignar en conflicto y mover
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/ordenes-servicio/${rescheduleState.ordenId}/editar`)}
                  disabled={loadingReschedule}
                >
                  Editar Orden
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleConfirmReschedule({ keepResources: true, removeConflicting: false })}
                  disabled={loadingReschedule}
                >
                  Mover de todos modos
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleConfirmReschedule({ keepResources: true, removeConflicting: false })}
                disabled={loadingReschedule}
              >
                {loadingReschedule ? 'Guardando...' : 'Confirmar'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
