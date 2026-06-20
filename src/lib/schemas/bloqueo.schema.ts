import { z } from 'zod'

export const bloqueoSchema = z.object({
  tipo_recurso: z.enum(['tecnico', 'vehiculo', 'equipo'], {
    message: 'Selecciona un tipo de recurso',
  }),
  recurso_id: z.string().min(1, 'Selecciona un recurso'),
  tipo_bloqueo: z.enum(
    ['vacaciones', 'incapacidad', 'mantenimiento', 'calibracion', 'prestamo', 'otro'],
    { message: 'Selecciona un tipo de bloqueo' }
  ),
  fecha_inicio: z.string().min(1, 'Fecha inicio requerida'),
  fecha_fin: z.string().min(1, 'Fecha fin requerida'),
  observaciones: z.string().optional().default(''),
})

export type BloqueoFormValues = z.input<typeof bloqueoSchema>
