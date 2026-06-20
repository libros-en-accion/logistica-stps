'use client'

import { useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '@/hooks/useCRUD'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { FormDialog } from '@/components/shared/FormDialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TecnicoForm } from '@/components/catalogos/TecnicoForm'
import { Button } from '@/components/ui/button'
import type { Tecnico } from '@/types/database.types'
import { nullToUndefined } from '@/lib/utils/formato'

const columns: Column<Tecnico>[] = [
  { key: 'nombre', label: 'Nombre', sortable: true,
    render: (t) => `${t.nombre} ${t.apellidos}` },
  { key: 'rfc', label: 'RFC', sortable: true },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Email' },
  { key: 'estado', label: 'Estado', render: (t) => <StatusBadge status={t.estado} /> },
]

export default function TecnicosPage() {
  const crud = useCRUD<Tecnico>({ table: 'tecnicos', orderBy: 'apellidos', orderDirection: 'asc' })

  useEffect(() => { crud.fetchAll() }, [])

  async function handleSubmit(data: Record<string, unknown>) {
    const isEdit = !!crud.selected
    const mensaje = isEdit
      ? '¿Está seguro de que desea guardar las modificaciones realizadas?'
      : '¿Está seguro de que desea registrar este nuevo técnico?'

    if (confirm(mensaje)) {
      if (isEdit) {
        await crud.update(crud.selected!.id, data)
      } else {
        await crud.create(data)
      }
      crud.closeDialog()
    }
  }

  const columnsWithActions: Column<Tecnico>[] = [
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
            if (confirm(`¿Está seguro de eliminar al técnico ${item.nombre} ${item.apellidos}?`)) {
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
          <h1 className="text-3xl font-bold tracking-tight">Técnicos</h1>
          <p className="text-muted-foreground">Gestión de técnicos evaluadores</p>
        </div>
      </div>

      <DataTable
        columns={columnsWithActions}
        data={crud.data}
        loading={crud.loading}
        searchable
        searchPlaceholder="Buscar por nombre o RFC..."
        actions={
          <Button onClick={crud.openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Agregar
          </Button>
        }
        exportFilename="tecnicos"
      />

      <FormDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        title={crud.selected ? 'Editar Técnico' : 'Nuevo Técnico'}
        description={crud.selected ? 'Modifica los datos del técnico' : 'Registra un nuevo técnico evaluador'}
        formId="tecnico-form"
        loading={crud.loading}
      >
        <TecnicoForm
          defaultValues={nullToUndefined(crud.selected) as any}
          onSubmit={handleSubmit}
          loading={crud.loading}
        />
      </FormDialog>
    </div>
  )
}

