import type { ValidacionResult, DatosValidacion } from './tipos'
import { validarDisponibilidadTecnico } from './validar-tecnico'
import { validarDisponibilidadVehiculo } from './validar-vehiculo'
import { validarDisponibilidadEquipo } from './validar-equipo'
import { createClient } from '@/lib/supabase/client'

/**
 * Motor de validación principal.
 * Evalúa disponibilidad de todos los recursos para una orden de servicio.
 */
export async function validarOrdenServicio(
  datos: DatosValidacion
): Promise<ValidacionResult> {
  const errores: ValidacionResult['errores'] = []
  const advertencias: ValidacionResult['advertencias'] = []
  const supabase = createClient()

  const rango = { inicio: datos.fechaInicio, fin: datos.fechaFin }

  // Obtener info de técnicos para verificar certificaciones
  const { data: tecnicos } = await supabase
    .from('tecnicos')
    .select('id, nombre, apellidos')
    .in('id', datos.tecnicosIds)

  const tecnicosMap = new Map(tecnicos?.map((t) => [t.id, `${t.nombre} ${t.apellidos}`]) ?? [])

  // Verificar certificaciones de técnicos contra normas requeridas
  if (datos.normasIds.length > 0 && datos.tecnicosIds.length > 0) {
    const { data: certificaciones } = await supabase
      .from('tecnico_normas')
      .select('tecnico_id, norma_id')
      .in('tecnico_id', datos.tecnicosIds)
      .in('norma_id', datos.normasIds)

    const certSet = new Set(
      (certificaciones ?? []).map((c) => `${c.tecnico_id}:${c.norma_id}`)
    )

    for (const tecnicoId of datos.tecnicosIds) {
      for (const normaId of datos.normasIds) {
        if (!certSet.has(`${tecnicoId}:${normaId}`)) {
          const { data: norma } = await supabase
            .from('normas_stps')
            .select('clave')
            .eq('id', normaId)
            .single()

          errores.push({
            tipo: 'tecnico',
            recurso_id: tecnicoId,
            recurso_nombre: tecnicosMap.get(tecnicoId) ?? 'Técnico',
            motivo: 'sin_certificacion',
            detalle: `El técnico no está certificado para la norma ${norma?.clave ?? normaId}`,
          })
        }
      }
    }
  }

  // Ejecutar validaciones en paralelo
  const resultados = await Promise.all([
    ...datos.tecnicosIds.map((id) =>
      validarDisponibilidadTecnico(id, rango, datos.ordenId)
    ),
    ...datos.vehiculosIds.map((id) =>
      validarDisponibilidadVehiculo(id, rango, datos.ordenId)
    ),
    ...datos.equiposIds.map((id) =>
      validarDisponibilidadEquipo(id, rango, datos.normasIds, datos.ordenId)
    ),
  ])

  for (const r of resultados) {
    errores.push(...r.errores)
    advertencias.push(...r.advertencias)
  }

  return {
    valido: errores.length === 0,
    errores,
    advertencias,
  }
}

/**
 * Valida un recurso individual (útil para validación en tiempo real en formularios).
 */
export async function validarRecursoIndividual(
  tipo: 'tecnico' | 'vehiculo' | 'equipo',
  recursoId: string,
  fechaInicio: Date,
  fechaFin: Date,
  normasIds: string[] = [],
  ordenId?: string
): Promise<ValidacionResult> {
  const rango = { inicio: fechaInicio, fin: fechaFin }

  let resultado
  if (tipo === 'tecnico') {
    resultado = await validarDisponibilidadTecnico(recursoId, rango, ordenId)
  } else if (tipo === 'vehiculo') {
    resultado = await validarDisponibilidadVehiculo(recursoId, rango, ordenId)
  } else {
    resultado = await validarDisponibilidadEquipo(recursoId, rango, normasIds, ordenId)
  }

  return {
    valido: resultado.errores.length === 0,
    errores: resultado.errores,
    advertencias: resultado.advertencias,
  }
}
