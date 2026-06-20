import { z } from 'zod'

export const tecnicoSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido (mín. 2 caracteres)'),
  apellidos: z.string().min(2, 'Apellidos requeridos (mín. 2 caracteres)'),
  rfc: z
    .string()
    .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, 'RFC inválido (formato: AAA000000XXX)'),
  telefono: z.string().optional().default(''),
  email: z.string().email('Email inválido').optional().or(z.literal('')).default(''),
  direccion: z.string().optional().default(''),
})

export type TecnicoFormValues = z.input<typeof tecnicoSchema>
