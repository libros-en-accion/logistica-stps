'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tecnicoSchema, type TecnicoFormValues } from '@/lib/schemas/tecnico.schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  defaultValues?: Partial<TecnicoFormValues>
  onSubmit: (data: TecnicoFormValues) => Promise<void>
  loading?: boolean
}

export function TecnicoForm({ defaultValues, onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TecnicoFormValues>({
    resolver: zodResolver(tecnicoSchema),
    defaultValues: {
      nombre: '',
      apellidos: '',
      rfc: '',
      telefono: '',
      email: '',
      direccion: '',
      ...defaultValues,
    },
  })

  return (
    <form id="tecnico-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" {...register('nombre')} />
          {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input id="apellidos" {...register('apellidos')} />
          {errors.apellidos && <p className="text-xs text-destructive">{errors.apellidos.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rfc">RFC</Label>
        <Input id="rfc" placeholder="PEGJ800101XXX" {...register('rfc')} />
        {errors.rfc && <p className="text-xs text-destructive">{errors.rfc.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" {...register('telefono')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Textarea id="direccion" {...register('direccion')} />
      </div>
    </form>
  )
}
