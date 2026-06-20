'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'

interface OSRow {
  id: string
  folio: string
  cliente_razon_social: string
  fecha_inicio: string
  fecha_fin: string
  estado: string
  tecnicos: string
}

export default function OrdenesServicioPage() {
  const [data, setData] = useState<OSRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('ordenes_servicio')
      .select('id, folio, fecha_inicio, fecha_fin, estado, clientes!inner(razon_social)')
      .order('created_at', { ascending: false })
      .then(({ data: rows, error }) => {
        if (!error && rows) {
          setData(
            (rows as any[]).map((r) => ({
              id: r.id,
              folio: r.folio,
              cliente_razon_social: r.clientes?.razon_social ?? '-',
              fecha_inicio: new Date(r.fecha_inicio).toLocaleDateString('es-MX'),
              fecha_fin: new Date(r.fecha_fin).toLocaleDateString('es-MX'),
              estado: r.estado,
              tecnicos: '-',
            }))
          )
        }
        setLoading(false)
      })
  }, [])

  const columns: Column<OSRow>[] = [
    { key: 'folio', label: 'Folio', sortable: true },
    { key: 'cliente_razon_social', label: 'Cliente', sortable: true },
    { key: 'fecha_inicio', label: 'Fecha inicio', sortable: true },
    { key: 'fecha_fin', label: 'Fecha fin', sortable: true },
    { key: 'estado', label: 'Estado', render: (r) => <StatusBadge status={r.estado} /> },
    {
      key: 'acciones',
      label: '',
      render: (r) => (
        <Link href={`/ordenes-servicio/${r.id}`}>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Órdenes de Servicio</h1>
          <p className="text-muted-foreground">Gestión de evaluaciones STPS en campo</p>
        </div>
      </div>

      <DataTable<OSRow>
        columns={columns}
        data={data}
        loading={loading}
        searchable
        searchPlaceholder="Buscar por folio o cliente..."
        actions={
          <Link href="/ordenes-servicio/nueva">
            <Button>
              <Plus className="mr-1 h-4 w-4" /> Nueva Orden
            </Button>
          </Link>
        }
      />
    </div>
  )
}
