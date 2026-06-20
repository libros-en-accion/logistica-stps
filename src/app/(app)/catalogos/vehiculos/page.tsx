'use client'

import { useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '@/hooks/useCRUD'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { FormDialog } from '@/components/shared/FormDialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { VehiculoForm } from '@/components/catalogos/VehiculoForm'
import { Button } from '@/components/ui/button'
import type { Vehiculo } from '@/types/database.types'
import { cn } from '@/lib/utils'
import { nullToUndefined } from '@/lib/utils/formato'

const columns: Column<Vehiculo>[] = [
  { key: 'numero_unidad', label: 'Unidad', sortable: true },
  { key: 'marca', label: 'Marca', sortable: true },
  { key: 'modelo', label: 'Modelo', sortable: true },
  { key: 'anio', label: 'Año', sortable: true },
  { key: 'placas', label: 'Placas', sortable: true },
  { key: 'km_actual', label: 'Kilometraje', sortable: true,
    render: (v) => `${v.km_actual?.toLocaleString() ?? '-'} km` },
  { key: 'prox_mantto', label: 'Próx. Mantto.', sortable: true,
    render: (v) => {
      if (!v.prox_mantto) return '-'
      const days = Math.ceil((new Date(v.prox_mantto).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return (
        <span className={cn(days <= 7 && 'text-destructive font-medium', days <= 30 && 'text-yellow-600')}>
          {new Date(v.prox_mantto).toLocaleDateString('es-MX')}
          {days > 0 ? ` (${days}d)` : ' (vencido)'}
        </span>
      )
    } },
  { key: 'estado', label: 'Estado', render: (v) => <StatusBadge status={v.estado} /> },
]

export default function VehiculosPage() {
  const crud = useCRUD<Vehiculo>({ table: 'vehiculos', orderBy: 'numero_unidad', orderDirection: 'asc' })

  useEffect(() => { crud.fetchAll() }, [])

  async function handleSubmit(data: Record<string, unknown>) {
    if (crud.selected) {
      await crud.update(crud.selected.id, data)
    } else {
      await crud.create(data)
    }
    crud.closeDialog()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehículos</h1>
          <p className="text-muted-foreground">Gestión de flotilla vehicular</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={crud.data}
        loading={crud.loading}
        searchable
        searchPlaceholder="Buscar por unidad, marca o placas..."
        actions={
          <Button onClick={crud.openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Agregar
          </Button>
        }
        onExport={() => {}}
      />

      <FormDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        title={crud.selected ? 'Editar Vehículo' : 'Nuevo Vehículo'}
      >
        <VehiculoForm
          defaultValues={nullToUndefined(crud.selected) as any}
          onSubmit={handleSubmit}
          loading={crud.loading}
        />
      </FormDialog>
    </div>
  )
}
