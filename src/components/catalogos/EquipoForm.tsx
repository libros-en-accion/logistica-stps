'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { equipoSchema, type EquipoFormValues } from '@/lib/schemas/equipo.schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  defaultValues?: Partial<EquipoFormValues>
  onSubmit: (data: EquipoFormValues) => Promise<void>
  loading?: boolean
}

export function EquipoForm({ defaultValues, onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipoFormValues>({
    resolver: zodResolver(equipoSchema),
    defaultValues: {
      id_interno: '',
      descripcion: '',
      marca: '',
      modelo: '',
      numero_serie: '',
      fecha_calibracion: '',
      vigencia_calibracion: '',
      lab_calibracion: '',
      ...defaultValues,
    },
  })

  return (
    <form id="equipo-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id_interno">ID Interno</Label>
          <Input id="id_interno" placeholder="EQ-LX-001" {...register('id_interno')} />
          {errors.id_interno && <p className="text-xs text-destructive">{errors.id_interno.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="numero_serie">N° Serie</Label>
          <Input id="numero_serie" {...register('numero_serie')} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" {...register('descripcion')} />
        {errors.descripcion && <p className="text-xs text-destructive">{errors.descripcion.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="marca">Marca</Label>
          <Input id="marca" {...register('marca')} />
          {errors.marca && <p className="text-xs text-destructive">{errors.marca.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo</Label>
          <Input id="modelo" {...register('modelo')} />
          {errors.modelo && <p className="text-xs text-destructive">{errors.modelo.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha_calibracion">Fecha de calibración</Label>
          <Input id="fecha_calibracion" type="date" {...register('fecha_calibracion')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vigencia_calibracion">Vigencia de calibración</Label>
          <Input id="vigencia_calibracion" type="date" {...register('vigencia_calibracion')} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="lab_calibracion">Laboratorio de calibración</Label>
        <Input id="lab_calibracion" {...register('lab_calibracion')} />
      </div>
    </form>
  )
}
