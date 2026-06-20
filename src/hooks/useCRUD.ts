'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface UseCRUDOptions<T> {
  table: string
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  onError?: (error: string) => void
}

export function useCRUD<T extends { id: string }>({
  table,
  orderBy = 'created_at',
  orderDirection = 'desc',
  onError,
}: UseCRUDOptions<T>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<T | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const supabase = createClient()

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const { data: result, error } = await supabase
      .from(table)
      .select('*')
      .order(orderBy, { ascending: orderDirection === 'asc' })

    if (error) {
      toast.error(`Error al cargar datos: ${error.message}`)
      onError?.(error.message)
    } else {
      setData((result ?? []) as T[])
    }
    setLoading(false)
  }, [table, orderBy, orderDirection, supabase, onError])

  const create = useCallback(
    async (values: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from(table).insert(values as any)
      if (error) {
        toast.error(`Error al crear: ${error.message}`)
        return false
      }
      toast.success('Registro creado correctamente')
      await fetchAll()
      return true
    },
    [table, supabase, fetchAll]
  )

  const update = useCallback(
    async (id: string, values: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from(table).update(values as any).eq('id', id)
      if (error) {
        toast.error(`Error al actualizar: ${error.message}`)
        return false
      }
      toast.success('Registro actualizado correctamente')
      await fetchAll()
      return true
    },
    [table, supabase, fetchAll]
  )

  const remove = useCallback(
    async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) {
        toast.error(`Error al eliminar: ${error.message}`)
        return false
      }
      toast.success('Registro eliminado correctamente')
      await fetchAll()
      return true
    },
    [table, supabase, fetchAll]
  )

  const softDelete = useCallback(
    async (id: string, field = 'activo') => {
      return update(id, { [field]: false })
    },
    [update]
  )

  function openCreate() {
    setSelected(null)
    setDialogOpen(true)
  }

  function openEdit(item: T) {
    setSelected(item)
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setSelected(null)
  }

  return {
    data,
    loading,
    selected,
    dialogOpen,
    setDialogOpen,
    fetchAll,
    create,
    update,
    remove,
    softDelete,
    openCreate,
    openEdit,
    closeDialog,
  }
}
