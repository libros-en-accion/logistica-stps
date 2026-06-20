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
          <h1 className="text-3xl font-bold tracking-tight">Técnicos</h1>
          <p className="text-muted-foreground">Gestión de técnicos evaluadores</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={crud.data}
        loading={crud.loading}
        searchable
        searchPlaceholder="Buscar por nombre o RFC..."
        actions={
          <Button onClick={crud.openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Agregar
          </Button>
        }
      />

      <FormDialog
        open={crud.dialogOpen}
        onOpenChange={crud.setDialogOpen}
        title={crud.selected ? 'Editar Técnico' : 'Nuevo Técnico'}
        description={crud.selected ? 'Modifica los datos del técnico' : 'Registra un nuevo técnico evaluador'}
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
