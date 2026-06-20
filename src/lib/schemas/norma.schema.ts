import { z } from 'zod'

export const normaSchema = z.object({
  clave: z.string().min(1, 'Clave de norma requerida'),
  nombre: z.string().min(1, 'Nombre requerido'),
  descripcion: z.string().optional().default(''),
  activa: z.boolean().default(true),
})

export type NormaFormValues = z.input<typeof normaSchema>
