import type { ConflictoDetectado, Advertencia, RecursoInfo } from './tipos'
import { createClient } from '@/lib/supabase/client'

interface RangoFechas {
  inicio: Date
  fin: Date
}

export async function validarDisponibilidadTecnico(
  tecnicoId: string,
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

  // Obtener info del técnico
  const { data: tecnico } = await supabase
    .from('tecnicos')
    .select('id, nombre, apellidos, estado')
    .eq('id', tecnicoId)
    .single()

  if (!tecnico) {
    return {
      disponible: false,
      errores: [
        {
          tipo: 'tecnico',
          recurso_id: tecnicoId,
          recurso_nombre: 'Técnico no encontrado',
          motivo: 'ocupado',
          detalle: 'El técnico no existe en el sistema',
        },
      ],
      advertencias: [],
      info: null,
    }
  }

  const nombreTecnico = `${tecnico.nombre} ${tecnico.apellidos}`

  // Verificar si está bloqueado (vacaciones, incapacidad)
  const { data: bloqueos } = await supabase
    .from('bloqueos_recursos')
    .select('*')
    .eq('tipo_recurso', 'tecnico')
    .eq('recurso_id', tecnicoId)
    .lt('fecha_inicio', rango.fin.toISOString())
    .gt('fecha_fin', rango.inicio.toISOString())

  if (bloqueos && bloqueos.length > 0) {
    for (const b of bloqueos) {
      errores.push({
        tipo: 'tecnico',
        recurso_id: tecnicoId,
        recurso_nombre: nombreTecnico,
        motivo: 'bloqueado',
        conflicto_con: b.id,
        fecha_conflicto: b.fecha_inicio,
        detalle: `Técnico con ${b.tipo_bloqueo} del ${new Date(b.fecha_inicio).toLocaleDateString()} al ${new Date(b.fecha_fin).toLocaleDateString()}${b.observaciones ? `: ${b.observaciones}` : ''}`,
      })
    }
  }

  // Verificar asignaciones existentes (OS activas en el rango)
  let query = supabase
    .from('asignaciones_tecnicos')
    .select('orden_servicio_id, ordenes_servicio!inner(folio, fecha_inicio, fecha_fin, estado)')
    .eq('tecnico_id', tecnicoId)
    .not('ordenes_servicio.estado', 'in', '("cancelada","completada")')
    .lt('ordenes_servicio.fecha_fin', rango.fin.toISOString())
    .gt('ordenes_servicio.fecha_inicio', rango.inicio.toISOString())

  if (ordenId) {
    query = query.neq('orden_servicio_id', ordenId) as any
  }

  const { data: asignaciones } = await query

  if (asignaciones && asignaciones.length > 0) {
    for (const a of asignaciones) {
      const os = (a as any).ordenes_servicio
      errores.push({
        tipo: 'tecnico',
        recurso_id: tecnicoId,
        recurso_nombre: nombreTecnico,
        motivo: 'ocupado',
        conflicto_con: a.orden_servicio_id,
        fecha_conflicto: os.fecha_inicio,
        detalle: `Técnico ya asignado a ${os.folio} (${new Date(os.fecha_inicio).toLocaleDateString()} - ${new Date(os.fecha_fin).toLocaleDateString()})`,
      })
    }
  }

  // Advertencia: verificar si tiene muchos servicios en la semana (>4)
  const inicioSemana = new Date(rango.inicio)
  inicioSemana.setDate(inicioSemana.getDate() - 7)
  const { count } = await supabase
    .from('asignaciones_tecnicos')
    .select('*', { count: 'exact', head: true })
    .eq('tecnico_id', tecnicoId)
    .gte('created_at', inicioSemana.toISOString())

  if (count && count >= 4) {
    advertencias.push({
      tipo: 'tecnico',
      recurso_id: tecnicoId,
      recurso_nombre: nombreTecnico,
      motivo: 'sobrecarga',
      detalle: `${nombreTecnico} tiene ${count} servicios esta semana (recomendado: máx. 4)`,
    })
  }

  return {
    disponible: errores.length === 0,
    errores,
    advertencias,
    info: { id: tecnico.id, nombre: nombreTecnico, estado: tecnico.estado },
  }
}
