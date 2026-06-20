export const APP_NAME = 'STPS Logística'
export const APP_DESCRIPTION = 'Sistema Integrado de Control Logístico para Evaluaciones STPS'

export const ESTADOS_OS = {
  BORRADOR: 'borrador',
  PROGRAMADA: 'programada',
  EN_CURSO: 'en_curso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
} as const

export const ESTADOS_RECURSO = {
  DISPONIBLE: 'disponible',
  ASIGNADO: 'asignado',
  MANTENIMIENTO: 'en_mantenimiento',
  CALIBRACION: 'en_calibracion',
  BAJA: 'baja',
  VACACIONES: 'vacaciones',
  INCAPACIDAD: 'incapacidad',
} as const

export const TIPOS_BLOQUEO = {
  VACACIONES: 'vacaciones',
  INCAPACIDAD: 'incapacidad',
  MANTENIMIENTO: 'mantenimiento',
  CALIBRACION: 'calibracion',
  PRESTAMO: 'prestamo',
  OTRO: 'otro',
} as const

export const TIPOS_RECURSO = {
  TECNICO: 'tecnico',
  VEHICULO: 'vehiculo',
  EQUIPO: 'equipo',
} as const

export const ROLES = {
  ADMIN: 'admin',
  COORDINADOR: 'coordinador',
  SUPERVISOR: 'supervisor',
  TECNICO: 'tecnico',
} as const
