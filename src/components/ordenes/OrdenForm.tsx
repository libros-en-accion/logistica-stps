'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ordenServicioSchema, type OrdenServicioFormValues } from '@/lib/schemas/orden-servicio.schema'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConflictAlert } from '@/components/shared/ConflictAlert'
import { ResourceAvailabilityIndicator } from '@/components/shared/ResourceAvailabilityIndicator'
import { validarOrdenServicio } from '@/lib/validations/motor-validacion'
import type { ConflictoDetectado, Advertencia } from '@/lib/validations/tipos'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Props {
  onSuccess?: () => void
}

export function OrdenForm({ onSuccess }: Props) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState<ConflictoDetectado[]>([])
  const [advertencias, setAdvertencias] = useState<Advertencia[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [normas, setNormas] = useState<any[]>([])
  const [tecnicos, setTecnicos] = useState<any[]>([])
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [equipos, setEquipos] = useState<any[]>([])
  const supabase = createClient()

  const form = useForm<OrdenServicioFormValues>({
    resolver: zodResolver(ordenServicioSchema),
    defaultValues: {
      cliente_id: '',
      direccion_servicio: '',
      fecha_inicio: '',
      fecha_fin: '',
      normas_ids: [],
      tecnicos_ids: [],
      vehiculos_ids: [],
      equipos_ids: [],
      observaciones: '',
    },
  })

  const normasIds = form.watch('normas_ids')
  const fechaInicio = form.watch('fecha_inicio')
  const fechaFin = form.watch('fecha_fin')

  // Cargar catálogos al montar
  useState(() => {
    Promise.all([
      supabase.from('clientes').select('id, razon_social, rfc').eq('activo', true).order('razon_social'),
      supabase.from('normas_stps').select('id, clave, nombre').eq('activa', true).order('clave'),
      supabase.from('tecnicos').select('id, nombre, apellidos').eq('activo', true).order('apellidos'),
      supabase.from('vehiculos').select('id, numero_unidad, marca, modelo, placas').eq('activo', true).order('numero_unidad'),
      supabase.from('equipos_medicion').select('id, id_interno, descripcion, vigencia_calibracion').eq('activo', true).order('id_interno'),
    ]).then(([c, n, t, v, e]) => {
      setClientes(c.data ?? [])
      setNormas(n.data ?? [])
      setTecnicos(t.data ?? [])
      setVehiculos(v.data ?? [])
      setEquipos(e.data ?? [])
    })
  })

  async function handleValidar() {
    if (!fechaInicio || !fechaFin) return

    const datos = {
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
      clienteId: form.getValues('cliente_id'),
      normasIds: form.getValues('normas_ids'),
      tecnicosIds: form.getValues('tecnicos_ids'),
      vehiculosIds: form.getValues('vehiculos_ids') ?? [],
      equiposIds: form.getValues('equipos_ids') ?? [],
    }

    setLoading(true)
    const result = await validarOrdenServicio(datos)
    setErrores(result.errores)
    setAdvertencias(result.advertencias)
    setLoading(false)

    if (result.valido) {
      setLoading(true)
      try {
        // 1. Guardar OS
        const { data: newOS, error: osError } = await supabase
          .from('ordenes_servicio')
          .insert({
            cliente_id: datos.clienteId,
            direccion_servicio: form.getValues('direccion_servicio'),
            fecha_inicio: datos.fechaInicio.toISOString(),
            fecha_fin: datos.fechaFin.toISOString(),
            observaciones: form.getValues('observaciones'),
            estado: 'programada',
          })
          .select('id')
          .single()

        if (osError) throw new Error(`Error al crear la orden: ${osError.message}`)
        const osId = newOS.id

        // 2. Guardar normas evaluadas (M:M)
        if (datos.normasIds.length > 0) {
          const normasInserts = datos.normasIds.map((normaId: string) => ({
            orden_servicio_id: osId,
            norma_id: normaId,
          }))
          const { error: normasError } = await supabase
            .from('ordenes_normas')
            .insert(normasInserts)
          if (normasError) throw new Error(`Error al asociar normas a la orden: ${normasError.message}`)
        }

        // 3. Guardar técnicos asignados
        if (datos.tecnicosIds.length > 0) {
          const tecnicosInserts = datos.tecnicosIds.map((tecnicoId: string) => ({
            orden_servicio_id: osId,
            tecnico_id: tecnicoId,
          }))
          const { error: tecnicosError } = await supabase
            .from('asignaciones_tecnicos')
            .insert(tecnicosInserts)
          if (tecnicosError) throw new Error(`Error al asignar técnicos: ${tecnicosError.message}`)
        }

        // 4. Guardar vehículos asignados
        if (datos.vehiculosIds.length > 0) {
          const vehiculosInserts = datos.vehiculosIds.map((vehiculoId: string) => ({
            orden_servicio_id: osId,
            vehiculo_id: vehiculoId,
          }))
          const { error: vehiculosError } = await supabase
            .from('asignaciones_vehiculos')
            .insert(vehiculosInserts)
          if (vehiculosError) throw new Error(`Error al asignar vehículos: ${vehiculosError.message}`)
        }

        // 5. Guardar equipos asignados
        if (datos.equiposIds.length > 0) {
          const equiposInserts = datos.equiposIds.map((equipoId: string) => ({
            orden_servicio_id: osId,
            equipo_id: equipoId,
          }))
          const { error: equiposError } = await supabase
            .from('asignaciones_equipos')
            .insert(equiposInserts)
          if (equiposError) throw new Error(`Error al asignar equipos: ${equiposError.message}`)
        }

        onSuccess?.()
      } catch (err: any) {
        toast.error(err.message || 'Error al guardar la orden de servicio')
        console.error('Error al guardar OS completa:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  function toggleArray(arr: string[], item: string): string[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
  }

  const steps = [
    { num: 1, label: 'Datos generales' },
    { num: 2, label: 'Asignación de recursos' },
    { num: 3, label: 'Confirmación' },
  ]

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
              step >= s.num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
              {s.num}
            </div>
            <span className={cn(
              'text-sm',
              step === s.num ? 'font-medium' : 'text-muted-foreground'
            )}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      {/* Paso 1: Datos generales */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Datos generales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.watch('cliente_id')}
                onChange={(e) => form.setValue('cliente_id', e.target.value)}
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.razon_social} ({c.rfc})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Dirección del servicio</Label>
              <Textarea
                placeholder="Dirección donde se realizará la evaluación"
                value={form.watch('direccion_servicio')}
                onChange={(e) => form.setValue('direccion_servicio', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha y hora inicio</Label>
                <Input
                  type="datetime-local"
                  value={fechaInicio}
                  onChange={(e) => form.setValue('fecha_inicio', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha y hora fin</Label>
                <Input
                  type="datetime-local"
                  value={fechaFin}
                  onChange={(e) => form.setValue('fecha_fin', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Normas a evaluar</Label>
              <div className="flex flex-wrap gap-2">
                {normas.map((n) => {
                  const selected = normasIds.includes(n.id)
                  return (
                    <Badge
                      key={n.id}
                      variant={selected ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => form.setValue('normas_ids', toggleArray(normasIds, n.id))}
                    >
                      {n.clave}
                    </Badge>
                  )
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                placeholder="Notas adicionales..."
                value={form.watch('observaciones')}
                onChange={(e) => form.setValue('observaciones', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 2: Asignación de recursos */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Asignación de recursos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Técnicos</Label>
              <div className="flex flex-wrap gap-2">
                {tecnicos.map((t) => {
                  const selected = form.watch('tecnicos_ids').includes(t.id)
                  return (
                    <Badge
                      key={t.id}
                      variant={selected ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => form.setValue('tecnicos_ids', toggleArray(form.watch('tecnicos_ids'), t.id))}
                    >
                      {t.nombre} {t.apellidos}
                    </Badge>
                  )
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vehículos</Label>
              <div className="flex flex-wrap gap-2">
                {vehiculos.map((v) => {
                  const selected = (form.watch('vehiculos_ids') ?? []).includes(v.id)
                  return (
                    <Badge
                      key={v.id}
                      variant={selected ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => form.setValue('vehiculos_ids', toggleArray(form.watch('vehiculos_ids') ?? [], v.id))}
                    >
                      {v.numero_unidad} - {v.marca} {v.modelo} ({v.placas})
                    </Badge>
                  )
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Equipos de medición</Label>
              <div className="flex flex-wrap gap-2">
                {equipos.map((e) => {
                  const selected = (form.watch('equipos_ids') ?? []).includes(e.id)
                  return (
                    <Badge
                      key={e.id}
                      variant={selected ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => form.setValue('equipos_ids', toggleArray(form.watch('equipos_ids') ?? [], e.id))}
                    >
                      {e.id_interno} - {e.descripcion}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paso 3: Confirmación */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Confirmación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
              <p><strong>Cliente:</strong> {clientes.find((c) => c.id === form.watch('cliente_id'))?.razon_social ?? '-'}</p>
              <p><strong>Dirección:</strong> {form.watch('direccion_servicio')}</p>
              <p><strong>Inicio:</strong> {fechaInicio ? new Date(fechaInicio).toLocaleString('es-MX') : '-'}</p>
              <p><strong>Fin:</strong> {fechaFin ? new Date(fechaFin).toLocaleString('es-MX') : '-'}</p>
              <p><strong>Normas:</strong> {normas.filter((n) => normasIds.includes(n.id)).map((n) => n.clave).join(', ')}</p>
              <p><strong>Técnicos:</strong> {tecnicos.filter((t) => form.watch('tecnicos_ids').includes(t.id)).map((t) => `${t.nombre} ${t.apellidos}`).join(', ')}</p>
              <p><strong>Vehículos:</strong> {vehiculos.filter((v) => (form.watch('vehiculos_ids') ?? []).includes(v.id)).map((v) => v.numero_unidad).join(', ') || 'Ninguno'}</p>
              <p><strong>Equipos:</strong> {equipos.filter((e) => (form.watch('equipos_ids') ?? []).includes(e.id)).map((e) => e.id_interno).join(', ') || 'Ninguno'}</p>
            </div>

            <ConflictAlert errores={errores} advertencias={advertencias} />

            <Button
              className="w-full"
              disabled={loading || errores.length > 0}
              onClick={handleValidar}
            >
              {loading ? 'Validando...' : errores.length > 0 ? 'Corregir conflictos' : 'Confirmar y Guardar'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navegación entre pasos */}
      <div className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Anterior
          </Button>
        ) : <div />}
        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)}>
            Siguiente
          </Button>
        ) : null}
      </div>
    </div>
  )
}
