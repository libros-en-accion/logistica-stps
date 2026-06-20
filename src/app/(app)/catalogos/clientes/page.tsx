'use client'

import { useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useCRUD } from '@/hooks/useCRUD'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { FormDialog } from '@/components/shared/FormDialog'
import { ClienteForm } from '@/components/catalogos/ClienteForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Cliente } from '@/types/database.types'
import { nullToUndefined } from '@/lib/utils/formato'

const columns: Column<Cliente>[] = [
  { key: 'razon_social', label: 'Razón Social', sortable: true },
  { key: 'rfc', label: 'RFC', sortable: true },
  { key: 'contacto_nombre', label: 'Contacto' },
  { key: 'contacto_tel', label: 'Teléfono' },
  { key: 'contacto_email', label: 'Email' },
  {
    key: 'activo',
    label: 'Estado',
    render: (c) => c.activo
      ? <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Activo</Badge>
      : <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Inactivo</Badge>,
  },
]

export default function ClientesPage() {
  const crud = useCRUD<Cliente>({ table: 'clientes', orderBy: 'razon_social', orderDirection: 'asc' })

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
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Empresas cliente del sistema</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={crud.data}
        loading={crud.loading}
        searchable
        searchPlaceholder="Buscar por razón social o RFC..."
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
        title={crud.selected ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        <ClienteForm
          defaultValues={nullToUndefined(crud.selected) as any}
          onSubmit={handleSubmit}
          loading={crud.loading}
        />
      </FormDialog>
    </div>
  )
}
