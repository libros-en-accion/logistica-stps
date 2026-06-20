import { z } from 'zod'

export const ordenServicioSchema = z.object({
  cliente_id: z.string().min(1, 'Cliente requerido'),
  direccion_servicio: z.string().min(1, 'Dirección del servicio requerida'),
  fecha_inicio: z.string().min(1, 'Fecha inicio requerida'),
  fecha_fin: z.string().min(1, 'Fecha fin requerida'),
  normas_ids: z.array(z.string()).min(1, 'Selecciona al menos una norma'),
  tecnicos_ids: z.array(z.string()).min(1, 'Selecciona al menos un técnico'),
  vehiculos_ids: z.array(z.string()).optional().default([]),
  equipos_ids: z.array(z.string()).optional().default([]),
  observaciones: z.string().optional().default(''),
})

export type OrdenServicioFormValues = z.input<typeof ordenServicioSchema>
