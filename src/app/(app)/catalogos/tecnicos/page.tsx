'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useCRUD } from '@/hooks/useCRUD'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { FormDialog } from '@/components/shared/FormDialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TecnicoForm } from '@/components/catalogos/TecnicoForm'
import { Button } from '@/components/ui/button'
import type { Tecnico } from '@/types/database.types'
import { nullToUndefined } from '@/lib/utils/formato'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

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
  const supabase = createClient()
  const [normas, setNormas] = useState<any[]>([])
  const [selectedNormasIds, setSelectedNormasIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // Cargar normas activas al montar la página
  useEffect(() => {
    supabase
      .from('normas_stps')
      .select('id, clave, nombre')
      .eq('activa', true)
      .order('clave')
      .then(({ data }) => {
        setNormas(data ?? [])
      })
  }, [supabase])

  // Cargar certificaciones del técnico seleccionado al editar
  useEffect(() => {
    if (crud.selected) {
      supabase
        .from('tecnico_normas')
        .select('norma_id')
        .eq('tecnico_id', crud.selected.id)
        .then(({ data }) => {
          setSelectedNormasIds((data ?? []).map((row) => row.norma_id))
        })
    } else {
      setSelectedNormasIds([])
    }
  }, [crud.selected, supabase])

  async function handleSubmit(data: Record<string, unknown>) {
    const isEdit = !!crud.selected
    const mensaje = isEdit
      ? '¿Está seguro de que desea guardar las modificaciones realizadas?'
      : '¿Está seguro de que desea registrar este nuevo técnico?'

    if (confirm(mensaje)) {
      setSaving(true)
      const { normas_ids, ...tecnicoData } = data as any

      try {
        let tecnicoId = crud.selected?.id

        if (isEdit) {
          // 1. Actualizar tabla tecnicos
          const { error: updateError } = await supabase
            .from('tecnicos')
            .update(tecnicoData)
            .eq('id', tecnicoId)
          if (updateError) throw new Error(`Error al actualizar técnico: ${updateError.message}`)

          // 2. Eliminar certificaciones previas
          const { error: deleteError } = await supabase
            .from('tecnico_normas')
            .delete()
            .eq('tecnico_id', tecnicoId)
          if (deleteError) throw new Error(`Error al remover certificaciones previas: ${deleteError.message}`)
        } else {
          // 1. Insertar nuevo técnico
          const { data: newTecnico, error: insertError } = await supabase
            .from('tecnicos')
            .insert(tecnicoData)
            .select('id')
            .single()
          if (insertError) throw new Error(`Error al registrar técnico: ${insertError.message}`)
          tecnicoId = newTecnico.id
        }

        // 3. Insertar nuevas certificaciones
        if (normas_ids && normas_ids.length > 0) {
          const relationInserts = normas_ids.map((normaId: string) => ({
            tecnico_id: tecnicoId,
            norma_id: normaId,
          }))

          const { error: relationError } = await supabase
            .from('tecnico_normas')
            .insert(relationInserts)
          if (relationError) throw new Error(`Error al guardar certificaciones: ${relationError.message}`)
        }

        toast.success(isEdit ? 'Técnico actualizado correctamente' : 'Técnico creado correctamente')
        await crud.fetchAll()
        crud.closeDialog()
      } catch (err: any) {
        toast.error(err.message || 'Error inesperado')
      } finally {
        setSaving(false)
      }
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
        loading={crud.loading || saving}
      >
        <TecnicoForm
          defaultValues={{
            ...nullToUndefined(crud.selected),
            normas_ids: selectedNormasIds,
          } as any}
          onSubmit={handleSubmit}
          loading={crud.loading || saving}
          normas={normas}
        />
      </FormDialog>
    </div>
  )
}
