'use client'

import { useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '@/hooks/useCRUD'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { FormDialog } from '@/components/shared/FormDialog'
import { NormaForm } from '@/components/catalogos/NormaForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NormaSTPS } from '@/types/database.types'
import { nullToUndefined } from '@/lib/utils/formato'

const columns: Column<NormaSTPS>[] = [
  { key: 'clave', label: 'Clave', sortable: true },
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'descripcion', label: 'Descripción' },
  {
    key: 'activa',
    label: 'Estado',
    render: (n) => n.activa
      ? <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Activa</Badge>
      : <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Inactiva</Badge>,
  },
]

export default function NormasPage() {
  const crud = useCRUD<NormaSTPS>({ table: 'normas_stps', orderBy: 'clave', orderDirection: 'asc' })

  useEffect(() => { crud.fetchAll() }, [])

  async function handleSubmit(data: Record<string, unknown>) {
    const isEdit = !!crud.selected
    const mensaje = isEdit
      ? '¿Está seguro de que desea guardar las modificaciones realizadas?'
      : '¿Está seguro de que desea registrar esta nueva norma?'

    if (confirm(mensaje)) {
      if (isEdit) {
        await crud.update(crud.selected!.id, data)
      } else {
        await crud.create(data)
      }
      crud.closeDialog()
    }
  }

  const columnsWithActions: Column<NormaSTPS>[] = [
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
            if (confirm(`¿Está seguro de eliminar la norma ${item.clave}?`)) {
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
          <h1 className="text-3xl font-bold tracking-tight">Normas STPS</h1>
          <p className="text-muted-foreground">Catálogo de normas oficiales mexicanas</p>
        </div>
      </div>

      <DataTable
        columns={columnsWithActions}
        data={crud.data}
        loading={crud.loading}
        searchable
        searchPlaceholder="Buscar por clave o nombre..."
        actions={
          <Button onClick={crud.openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Agregar
          </Button>
        }
      />

      <FormDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        title={crud.selected ? 'Editar Norma' : 'Nueva Norma'}
        formId="norma-form"
        loading={crud.loading}
      >
        <NormaForm
          defaultValues={nullToUndefined(crud.selected) as any}
          onSubmit={handleSubmit}
          loading={crud.loading}
        />
      </FormDialog>
    </div>
  )
}

