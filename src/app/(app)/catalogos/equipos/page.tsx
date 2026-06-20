'use client'

import { useEffect } from 'react'
import { Plus, AlertTriangle, XCircle, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '@/hooks/useCRUD'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { FormDialog } from '@/components/shared/FormDialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EquipoForm } from '@/components/catalogos/EquipoForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { EquipoMedicion } from '@/types/database.types'
import { cn } from '@/lib/utils'
import { nullToUndefined } from '@/lib/utils/formato'

const columns: Column<EquipoMedicion>[] = [
  { key: 'id_interno', label: 'ID Interno', sortable: true },
  { key: 'descripcion', label: 'Descripción', sortable: true },
  { key: 'marca', label: 'Marca', sortable: true },
  { key: 'modelo', label: 'Modelo', sortable: true },
  { key: 'numero_serie', label: 'N° Serie' },
  {
    key: 'vigencia_calibracion',
    label: 'Vigencia Cal.',
    sortable: true,
    render: (e) => {
      if (!e.vigencia_calibracion) return <span className="text-muted-foreground">Sin registro</span>
      const days = Math.ceil((new Date(e.vigencia_calibracion).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return (
        <div className="flex items-center gap-1.5">
          <span className={cn(
            days < 0 && 'text-destructive',
            days >= 0 && days <= 30 && 'text-yellow-600',
            days > 30 && ''
          )}>
            {new Date(e.vigencia_calibracion).toLocaleDateString('es-MX')}
          </span>
          {days < 0 && <XCircle className="h-3.5 w-3.5 text-destructive" aria-label="Vencida" />}
          {days >= 0 && days <= 30 && <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" aria-label="Próxima a vencer" />}
        </div>
      )
    },
  },
]

export default function EquiposPage() {
  const crud = useCRUD<EquipoMedicion>({ table: 'equipos_medicion', orderBy: 'id_interno', orderDirection: 'asc' })

  useEffect(() => { crud.fetchAll() }, [])

  async function handleSubmit(data: Record<string, unknown>) {
    const isEdit = !!crud.selected
    const mensaje = isEdit
      ? '¿Está seguro de que desea guardar las modificaciones realizadas?'
      : '¿Está seguro de que desea registrar este nuevo equipo?'

    if (confirm(mensaje)) {
      if (isEdit) {
        await crud.update(crud.selected!.id, data)
      } else {
        await crud.create(data)
      }
      crud.closeDialog()
    }
  }

  const columnsWithActions: Column<EquipoMedicion>[] = [
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
            if (confirm(`¿Está seguro de eliminar el equipo ${item.id_interno} (${item.descripcion})?`)) {
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
          <h1 className="text-3xl font-bold tracking-tight">Equipos de Medición</h1>
          <p className="text-muted-foreground">Instrumentos de medición y calibración</p>
        </div>
      </div>

      <DataTable
        columns={columnsWithActions}
        data={crud.data}
        loading={crud.loading}
        searchable
        searchPlaceholder="Buscar por ID interno, descripción o serie..."
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
        title={crud.selected ? 'Editar Equipo' : 'Nuevo Equipo'}
        formId="equipo-form"
        loading={crud.loading}
      >
        <EquipoForm
          defaultValues={nullToUndefined(crud.selected) as any}
          onSubmit={handleSubmit}
          loading={crud.loading}
        />
      </FormDialog>
    </div>
  )
}
