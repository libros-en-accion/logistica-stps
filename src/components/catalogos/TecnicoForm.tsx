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
  normas: any[]
}

export function TecnicoForm({ defaultValues, onSubmit, loading, normas }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      normas_ids: [],
      ...defaultValues,
    },
  })

  const selectedNormas = watch('normas_ids') || []

  function handleToggleNorma(normaId: string) {
    const next = selectedNormas.includes(normaId)
      ? selectedNormas.filter((id) => id !== normaId)
      : [...selectedNormas, normaId]
    setValue('normas_ids', next)
  }

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
      <div className="space-y-2">
        <Label>Certificaciones (Normas STPS)</Label>
        {normas.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay normas registradas o activas.</p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {normas.map((n) => {
              const selected = selectedNormas.includes(n.id)
              return (
                <div
                  key={n.id}
                  onClick={() => handleToggleNorma(n.id)}
                  className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors border select-none ${
                    selected
                      ? 'bg-primary text-primary-foreground border-primary font-semibold'
                      : 'bg-background text-foreground border-input hover:bg-muted'
                  }`}
                >
                  {n.clave}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </form>
  )
}
