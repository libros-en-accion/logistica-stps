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
    const isEdit = !!crud.selected
    const mensaje = isEdit
      ? '¿Está seguro de que desea guardar las modificaciones realizadas?'
      : '¿Está seguro de que desea registrar este nuevo vehículo?'

    if (confirm(mensaje)) {
      if (isEdit) {
        await crud.update(crud.selected!.id, data)
      } else {
        await crud.create(data)
      }
      crud.closeDialog()
    }
  }

  const columnsWithActions: Column<Vehiculo>[] = [
    ...columns,
    {
      key: 'acciones',
      label: 'Acciones',
      className: 'text-right w-[120px]',
      render: (item) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => crud.openEdit(item)} title="Editar">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => {
            if (confirm(`¿Está seguro de eliminar el vehículo unidad ${item.numero_unidad} (${item.marca} ${item.modelo})?`)) {
              crud.remove(item.id)
            }
          }} title="Eliminar">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehículos</h1>
          <p className="text-muted-foreground">Gestión de flotilla vehicular</p>
        </div>
      </div>

      <DataTable
        columns={columnsWithActions}
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
        formId="vehiculo-form"
        loading={crud.loading}
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

