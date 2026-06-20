'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { normaSchema, type NormaFormValues } from '@/lib/schemas/norma.schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  defaultValues?: Partial<NormaFormValues>
  onSubmit: (data: NormaFormValues) => Promise<void>
  loading?: boolean
}

export function NormaForm({ defaultValues, onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NormaFormValues>({
    resolver: zodResolver(normaSchema),
    defaultValues: {
      clave: '',
      nombre: '',
      descripcion: '',
      activa: true,
      ...defaultValues,
    },
  })

  return (
    <form id="norma-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clave">Clave de norma</Label>
          <Input id="clave" placeholder="NOM-001-STPS" {...register('clave')} />
          {errors.clave && <p className="text-xs text-destructive">{errors.clave.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" {...register('nombre')} />
        {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" {...register('descripcion')} />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="activa"
          type="checkbox"
          className="h-4 w-4 rounded border-border accent-primary"
          {...register('activa')}
        />
        <Label htmlFor="activa">Norma activa</Label>
      </div>
    </form>
  )
}
