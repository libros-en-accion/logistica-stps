import type { ConflictoDetectado, Advertencia, RecursoInfo } from './tipos'
import { createClient } from '@/lib/supabase/client'
import { differenceInDays } from 'date-fns'

interface RangoFechas {
  inicio: Date
  fin: Date
}

export async function validarDisponibilidadVehiculo(
  vehiculoId: string,
  rango: RangoFechas,
  ordenId?: string
): Promise<{
  disponible: boolean
  errores: ConflictoDetectado[]
  advertencias: Advertencia[]
  info: RecursoInfo | null
}> {
  const supabase = createClient()
  const errores: ConflictoDetectado[] = []
  const advertencias: Advertencia[] = []

  const { data: vehiculo } = await supabase
    .from('vehiculos')
    .select('id, numero_unidad, marca, modelo, placas, estado, km_actual, prox_mantto')
    .eq('id', vehiculoId)
    .single()

  if (!vehiculo) {
    return {
      disponible: false,
      errores: [
        {
          tipo: 'vehiculo',
          recurso_id: vehiculoId,
          recurso_nombre: 'Vehículo no encontrado',
          motivo: 'ocupado',
          detalle: 'El vehículo no existe en el sistema',
        },
      ],
      advertencias: [],
      info: null,
    }
  }

  const nombreVehiculo = `${vehiculo.numero_unidad} (${vehiculo.marca} ${vehiculo.modelo})`

  // Verificar bloqueos (mantenimiento, etc.)
  const { data: bloqueos } = await supabase
    .from('bloqueos_recursos')
    .select('*')
    .eq('tipo_recurso', 'vehiculo')
    .eq('recurso_id', vehiculoId)
    .lt('fecha_inicio', rango.fin.toISOString())
    .gt('fecha_fin', rango.inicio.toISOString())

  if (bloqueos && bloqueos.length > 0) {
    for (const b of bloqueos) {
      errores.push({
        tipo: 'vehiculo',
        recurso_id: vehiculoId,
        recurso_nombre: nombreVehiculo,
        motivo: 'bloqueado',
        conflicto_con: b.id,
        fecha_conflicto: b.fecha_inicio,
        detalle: `Vehículo en ${b.tipo_bloqueo} del ${new Date(b.fecha_inicio).toLocaleDateString()} al ${new Date(b.fecha_fin).toLocaleDateString()}`,
      })
    }
  }

  // Verificar asignaciones existentes
  let query = supabase
    .from('asignaciones_vehiculos')
    .select('orden_servicio_id, ordenes_servicio!inner(folio, fecha_inicio, fecha_fin, estado)')
    .eq('vehiculo_id', vehiculoId)
    .lt('ordenes_servicio.fecha_inicio', rango.fin.toISOString())
    .gt('ordenes_servicio.fecha_fin', rango.inicio.toISOString())

  if (ordenId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query = query.neq('orden_servicio_id', ordenId) as any
  }

  const { data: asignaciones } = await query

  const asignacionesActivas = (asignaciones ?? []).filter((a) => {
    const os = (a as any).ordenes_servicio
    return os && !['cancelada', 'completada'].includes(os.estado)
  })

  if (asignacionesActivas.length > 0) {
    for (const a of asignacionesActivas) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const os = (a as any).ordenes_servicio
      const inicioStr = new Date(os.fecha_inicio).toLocaleString('es-MX', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
      const finStr = new Date(os.fecha_fin).toLocaleString('es-MX', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
      errores.push({
        tipo: 'vehiculo',
        recurso_id: vehiculoId,
        recurso_nombre: nombreVehiculo,
        motivo: 'ocupado',
        conflicto_con: a.orden_servicio_id,
        fecha_conflicto: os.fecha_inicio,
        detalle: `Vehículo ya asignado a ${os.folio} (${inicioStr} - ${finStr})`,
      })
    }
  }

  // Advertencia: mantenimiento próximo
  if (vehiculo.prox_mantto) {
    const diasMantto = differenceInDays(new Date(vehiculo.prox_mantto), rango.inicio)
    if (diasMantto > 0 && diasMantto <= 7) {
      advertencias.push({
        tipo: 'vehiculo',
        recurso_id: vehiculoId,
        recurso_nombre: nombreVehiculo,
        motivo: 'mantenimiento_proximo',
        detalle: `Mantenimiento programado para ${new Date(vehiculo.prox_mantto).toLocaleDateString()} (en ${diasMantto} días)`,
      })
    }
  }

  return {
    disponible: errores.length === 0,
    errores,
    advertencias,
    info: {
      id: vehiculo.id,
      nombre: nombreVehiculo,
      estado: vehiculo.estado,
    },
  }
}
