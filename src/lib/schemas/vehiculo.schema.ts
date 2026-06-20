import { z } from 'zod'

export const vehiculoSchema = z.object({
  numero_unidad: z.string().min(1, 'Número de unidad requerido'),
  marca: z.string().min(1, 'Marca requerida'),
  modelo: z.string().min(1, 'Modelo requerido'),
  anio: z.coerce
    .number()
    .int()
    .min(1990, 'Año mínimo 1990')
    .max(new Date().getFullYear() + 1, 'Año inválido'),
  placas: z.string().min(1, 'Placas requeridas'),
  color: z.string().optional().default(''),
  vin: z.string().optional().default(''),
  km_actual: z.coerce.number().int().min(0).default(0),
  prox_mantto: z.string().optional().default(''),
})

export type VehiculoFormValues = z.input<typeof vehiculoSchema>
