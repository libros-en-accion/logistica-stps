'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vehiculoSchema, type VehiculoFormValues } from '@/lib/schemas/vehiculo.schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  defaultValues?: Partial<VehiculoFormValues>
  onSubmit: (data: VehiculoFormValues) => Promise<void>
  loading?: boolean
}

export function VehiculoForm({ defaultValues, onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehiculoFormValues>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: {
      numero_unidad: '',
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      placas: '',
      color: '',
      vin: '',
      km_actual: 0,
      prox_mantto: '',
      ...defaultValues,
    },
  })

  return (
    <form id="vehiculo-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numero_unidad">N° Unidad</Label>
          <Input id="numero_unidad" {...register('numero_unidad')} />
          {errors.numero_unidad && <p className="text-xs text-destructive">{errors.numero_unidad.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="placas">Placas</Label>
          <Input id="placas" {...register('placas')} />
          {errors.placas && <p className="text-xs text-destructive">{errors.placas.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
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
        <div className="space-y-2">
          <Label htmlFor="anio">Año</Label>
          <Input id="anio" type="number" {...register('anio')} />
          {errors.anio && <p className="text-xs text-destructive">{errors.anio.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" {...register('color')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vin">VIN</Label>
          <Input id="vin" {...register('vin')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="km_actual">Kilometraje actual</Label>
          <Input id="km_actual" type="number" {...register('km_actual')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prox_mantto">Próximo mantenimiento</Label>
          <Input id="prox_mantto" type="date" {...register('prox_mantto')} />
        </div>
      </div>
    </form>
  )
}
