import type { ConflictoDetectado, Advertencia, RecursoInfo } from './tipos'
import { createClient } from '@/lib/supabase/client'
import { differenceInDays } from 'date-fns'

interface RangoFechas {
  inicio: Date
  fin: Date
}

export async function validarDisponibilidadEquipo(
  equipoId: string,
  rango: RangoFechas,
  normasIds: string[],
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

  const { data: equipo } = await supabase
    .from('equipos_medicion')
    .select('id, id_interno, descripcion, marca, modelo, numero_serie, fecha_calibracion, vigencia_calibracion, estado')
    .eq('id', equipoId)
    .single()

  if (!equipo) {
    return {
      disponible: false,
      errores: [
        {
          tipo: 'equipo',
          recurso_id: equipoId,
          recurso_nombre: 'Equipo no encontrado',
          motivo: 'ocupado',
          detalle: 'El equipo no existe en el sistema',
        },
      ],
      advertencias: [],
      info: null,
    }
  }

  const nombreEquipo = `${equipo.id_interno} - ${equipo.descripcion}`

  // Verificar vigencia de calibración
  if (equipo.vigencia_calibracion) {
    const diasVigencia = differenceInDays(new Date(equipo.vigencia_calibracion), rango.inicio)

    if (diasVigencia < 0) {
      errores.push({
        tipo: 'equipo',
        recurso_id: equipoId,
        recurso_nombre: nombreEquipo,
        motivo: 'calibracion_vencida',
        fecha_conflicto: equipo.vigencia_calibracion,
        detalle: `Calibración vencida desde ${new Date(equipo.vigencia_calibracion).toLocaleDateString()}. Última calibración: ${equipo.fecha_calibracion ? new Date(equipo.fecha_calibracion).toLocaleDateString() : 'No registrada'}`,
      })
    } else if (diasVigencia <= 30) {
      advertencias.push({
        tipo: 'equipo',
        recurso_id: equipoId,
        recurso_nombre: nombreEquipo,
        motivo: 'calibracion_proxima',
        detalle: `Calibración vence en ${diasVigencia} días (${new Date(equipo.vigencia_calibracion).toLocaleDateString()})`,
      })
    }
  }

  // Verificar bloqueos
  const { data: bloqueos } = await supabase
    .from('bloqueos_recursos')
    .select('*')
    .eq('tipo_recurso', 'equipo')
    .eq('recurso_id', equipoId)
    .lt('fecha_inicio', rango.fin.toISOString())
    .gt('fecha_fin', rango.inicio.toISOString())

  if (bloqueos && bloqueos.length > 0) {
    for (const b of bloqueos) {
      errores.push({
        tipo: 'equipo',
        recurso_id: equipoId,
        recurso_nombre: nombreEquipo,
        motivo: 'bloqueado',
        conflicto_con: b.id,
        fecha_conflicto: b.fecha_inicio,
        detalle: `Equipo en ${b.tipo_bloqueo} del ${new Date(b.fecha_inicio).toLocaleDateString()} al ${new Date(b.fecha_fin).toLocaleDateString()}${b.observaciones ? `: ${b.observaciones}` : ''}`,
      })
    }
  }

  // Verificar asignaciones existentes
  let query = supabase
    .from('asignaciones_equipos')
    .select('orden_servicio_id, ordenes_servicio!inner(folio, fecha_inicio, fecha_fin, estado)')
    .eq('equipo_id', equipoId)
    .not('ordenes_servicio.estado', 'in', '("cancelada","completada")')
    .lt('ordenes_servicio.fecha_inicio', rango.fin.toISOString())
    .gt('ordenes_servicio.fecha_fin', rango.inicio.toISOString())

  if (ordenId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query = query.neq('orden_servicio_id', ordenId) as any
  }

  const { data: asignaciones } = await query

  if (asignaciones && asignaciones.length > 0) {
    for (const a of asignaciones) {
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
        tipo: 'equipo',
        recurso_id: equipoId,
        recurso_nombre: nombreEquipo,
        motivo: 'ocupado',
        conflicto_con: a.orden_servicio_id,
        fecha_conflicto: os.fecha_inicio,
        detalle: `Equipo ya asignado a ${os.folio} (${inicioStr} - ${finStr})`,
      })
    }
  }

  // Verificar si el equipo es requerido por alguna de las normas
  if (normasIds.length > 0) {
    const { data: equiposRequeridos } = await supabase
      .from('norma_equipos')
      .select('equipo_tipo')
      .in('norma_id', normasIds)

    const tiposRequeridos = [...new Set((equiposRequeridos ?? []).map((e) => e.equipo_tipo))]
    const tipoEquipo = equipo.descripcion.toLowerCase()

    // Verificación básica: el equipo es relevante si su tipo está en la lista de requeridos
    // Nota: esto requeriría una clasificación más precisa por tipo de equipo
  }

  return {
    disponible: errores.length === 0,
    errores,
    advertencias,
    info: {
      id: equipo.id,
      nombre: nombreEquipo,
      estado: equipo.estado,
    },
  }
}
