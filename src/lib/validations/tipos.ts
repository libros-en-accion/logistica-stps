export interface ConflictoDetectado {
  tipo: 'tecnico' | 'vehiculo' | 'equipo'
  recurso_id: string
  recurso_nombre: string
  motivo:
    | 'ocupado'
    | 'bloqueado'
    | 'calibracion_vencida'
    | 'sin_certificacion'
    | 'equipo_no_requerido'
  conflicto_con?: string
  fecha_conflicto?: string
  detalle: string
}

export interface Advertencia {
  tipo: 'tecnico' | 'vehiculo' | 'equipo'
  recurso_id: string
  recurso_nombre: string
  motivo: 'calibracion_proxima' | 'sobrecarga' | 'mantenimiento_proximo'
  detalle: string
}

export interface ValidacionResult {
  valido: boolean
  errores: ConflictoDetectado[]
  advertencias: Advertencia[]
}

export interface DatosValidacion {
  ordenId?: string
  fechaInicio: Date
  fechaFin: Date
  clienteId: string
  normasIds: string[]
  tecnicosIds: string[]
  vehiculosIds: string[]
  equiposIds: string[]
}

export interface RecursoInfo {
  id: string
  nombre: string
  estado: string
}
