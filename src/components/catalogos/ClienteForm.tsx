'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clienteSchema, type ClienteFormValues } from '@/lib/schemas/cliente.schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  defaultValues?: Partial<ClienteFormValues>
  onSubmit: (data: ClienteFormValues) => Promise<void>
  loading?: boolean
}

export function ClienteForm({ defaultValues, onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      razon_social: '',
      rfc: '',
      contacto_nombre: '',
      contacto_tel: '',
      contacto_email: '',
      direccion: '',
      ...defaultValues,
    },
  })

  return (
    <form id="cliente-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="razon_social">Razón Social</Label>
          <Input id="razon_social" {...register('razon_social')} />
          {errors.razon_social && <p className="text-xs text-destructive">{errors.razon_social.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="rfc">RFC</Label>
          <Input id="rfc" placeholder="AAA000000XXX" {...register('rfc')} />
          {errors.rfc && <p className="text-xs text-destructive">{errors.rfc.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contacto_nombre">Nombre de contacto</Label>
          <Input id="contacto_nombre" {...register('contacto_nombre')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contacto_tel">Teléfono</Label>
          <Input id="contacto_tel" {...register('contacto_tel')} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contacto_email">Email de contacto</Label>
        <Input id="contacto_email" type="email" {...register('contacto_email')} />
        {errors.contacto_email && <p className="text-xs text-destructive">{errors.contacto_email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Textarea id="direccion" {...register('direccion')} />
      </div>
    </form>
  )
}
