import { z } from 'zod'
import { differenceInDays } from 'date-fns'

export const equipoSchema = z.object({
  id_interno: z.string().min(1, 'ID interno requerido'),
  descripcion: z.string().min(1, 'Descripción requerida'),
  marca: z.string().min(1, 'Marca requerida'),
  modelo: z.string().min(1, 'Modelo requerido'),
  numero_serie: z.string().optional().default(''),
  fecha_calibracion: z.string().optional().default(''),
  vigencia_calibracion: z.string().optional().default(''),
  lab_calibracion: z.string().optional().default(''),
})

export type EquipoFormValues = z.input<typeof equipoSchema>
