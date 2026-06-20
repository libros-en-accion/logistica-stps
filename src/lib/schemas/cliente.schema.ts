import { z } from 'zod'

export const clienteSchema = z.object({
  razon_social: z.string().min(1, 'Razón social requerida'),
  rfc: z
    .string()
    .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/, 'RFC inválido (formato: AAA000000XXX)'),
  contacto_nombre: z.string().optional().default(''),
  contacto_tel: z.string().optional().default(''),
  contacto_email: z.string().email('Email inválido').optional().or(z.literal('')).default(''),
  direccion: z.string().optional().default(''),
})

export type ClienteFormValues = z.input<typeof clienteSchema>
