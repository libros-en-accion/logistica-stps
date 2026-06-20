'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { FormDialog } from '@/components/shared/FormDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface BloqueoRow {
  id: string
  tipo_recurso: string
  recurso_nombre: string
  tipo_bloqueo: string
  fecha_inicio: string
  fecha_fin: string
  observaciones: string | null
  estado: 'activo' | 'futuro' | 'finalizado'
}

const tipoRecursoLabel: Record<string, string> = {
  tecnico: 'Técnico',
  vehiculo: 'Vehículo',
  equipo: 'Equipo',
}

const tipoBloqueoLabel: Record<string, string> = {
  vacaciones: 'Vacaciones',
  incapacidad: 'Incapacidad',
  mantenimiento: 'Mantenimiento',
  calibracion: 'Calibración',
  prestamo: 'Préstamo',
  otro: 'Otro',
}

export default function BloqueosPage() {
  const [data, setData] = useState<BloqueoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tecnicos, setTecnicos] = useState<any[]>([])
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [equipos, setEquipos] = useState<any[]>([])
  const [form, setForm] = useState({
    tipo_recurso: 'tecnico' as string,
    recurso_id: '',
    tipo_bloqueo: 'vacaciones' as string,
    fecha_inicio: '',
    fecha_fin: '',
    observaciones: '',
  })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function load() {
    setLoading(true)
    const { data: bloqueos } = await supabase
      .from('bloqueos_recursos')
      .select('*')
      .order('fecha_inicio', { ascending: false })

    const now = new Date()
    const rows: BloqueoRow[] = await Promise.all(
      (bloqueos ?? []).map(async (b) => {
        let recurso_nombre = 'Desconocido'
        if (b.tipo_recurso === 'tecnico') {
          const { data } = await supabase.from('tecnicos').select('nombre, apellidos').eq('id', b.recurso_id).single()
          if (data) recurso_nombre = `${data.nombre} ${data.apellidos}`
        } else if (b.tipo_recurso === 'vehiculo') {
          const { data } = await supabase.from('vehiculos').select('numero_unidad').eq('id', b.recurso_id).single()
          if (data) recurso_nombre = data.numero_unidad
        } else if (b.tipo_recurso === 'equipo') {
          const { data } = await supabase.from('equipos_medicion').select('id_interno, descripcion').eq('id', b.recurso_id).single()
          if (data) recurso_nombre = `${data.id_interno} - ${data.descripcion}`
        }

        const inicio = new Date(b.fecha_inicio)
        const fin = new Date(b.fecha_fin)
        const estado = fin < now ? 'finalizado' : inicio > now ? 'futuro' : 'activo'

        return {
          id: b.id,
          tipo_recurso: b.tipo_recurso,
          recurso_nombre,
          tipo_bloqueo: b.tipo_bloqueo,
          fecha_inicio: b.fecha_inicio,
          fecha_fin: b.fecha_fin,
          observaciones: b.observaciones,
          estado,
        }
      })
    )

    setData(rows)
    setLoading(false)
  }

  async function loadCatalogos() {
    const [t, v, e] = await Promise.all([
      supabase.from('tecnicos').select('id, nombre, apellidos').eq('activo', true),
      supabase.from('vehiculos').select('id, numero_unidad').eq('activo', true),
      supabase.from('equipos_medicion').select('id, id_interno, descripcion').eq('activo', true),
    ])
    setTecnicos(t.data ?? [])
    setVehiculos(v.data ?? [])
    setEquipos(e.data ?? [])
  }

  useEffect(() => {
    load()
    loadCatalogos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit() {
    setSaving(true)
    const { error } = await supabase.from('bloqueos_recursos').insert({
      tipo_recurso: form.tipo_recurso,
      recurso_id: form.recurso_id,
      tipo_bloqueo: form.tipo_bloqueo,
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
      observaciones: form.observaciones || null,
    })
    setSaving(false)

    if (error) {
      toast.error('Error al crear bloqueo', { description: error.message })
      return
    }

    toast.success('Bloqueo creado correctamente')
    setDialogOpen(false)
    setForm({ tipo_recurso: 'tecnico', recurso_id: '', tipo_bloqueo: 'vacaciones', fecha_inicio: '', fecha_fin: '', observaciones: '' })
    load()
  }

  function getRecursos() {
    if (form.tipo_recurso === 'tecnico') return tecnicos.map((t) => ({ id: t.id, nombre: `${t.nombre} ${t.apellidos}` }))
    if (form.tipo_recurso === 'vehiculo') return vehiculos.map((v) => ({ id: v.id, nombre: v.numero_unidad }))
    return equipos.map((e) => ({ id: e.id, nombre: `${e.id_interno} - ${e.descripcion}` }))
  }

  const columns: Column<BloqueoRow>[] = [
    { key: 'tipo_recurso', label: 'Tipo', sortable: true, render: (r) => tipoRecursoLabel[r.tipo_recurso] ?? r.tipo_recurso },
    { key: 'recurso_nombre', label: 'Recurso', sortable: true },
    { key: 'tipo_bloqueo', label: 'Motivo', sortable: true, render: (r) => <Badge variant="outline">{tipoBloqueoLabel[r.tipo_bloqueo] ?? r.tipo_bloqueo}</Badge> },
    { key: 'fecha_inicio', label: 'Inicio', sortable: true, render: (r) => new Date(r.fecha_inicio).toLocaleDateString('es-MX') },
    { key: 'fecha_fin', label: 'Fin', sortable: true, render: (r) => new Date(r.fecha_fin).toLocaleDateString('es-MX') },
    {
      key: 'estado',
      label: 'Estado',
      render: (r) => {
        if (r.estado === 'activo') return <StatusBadge status="en_curso" />
        if (r.estado === 'futuro') return <StatusBadge status="programada" />
        return <StatusBadge status="completada" />
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bloqueos</h1>
          <p className="text-muted-foreground">Estados temporales de no disponibilidad de recursos</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchable
        searchPlaceholder="Buscar por recurso o motivo..."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Nuevo Bloqueo
          </Button>
        }
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Nuevo Bloqueo"
        description="Bloquea un recurso por un período específico"
        submitLabel="Crear Bloqueo"
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de recurso</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.tipo_recurso}
              onChange={(e) => setForm({ ...form, tipo_recurso: e.target.value, recurso_id: '' })}
            >
              <option value="tecnico">Técnico</option>
              <option value="vehiculo">Vehículo</option>
              <option value="equipo">Equipo</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Recurso</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.recurso_id}
              onChange={(e) => setForm({ ...form, recurso_id: e.target.value })}
            >
              <option value="">Seleccionar...</option>
              {getRecursos().map((r) => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Tipo de bloqueo</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.tipo_bloqueo}
              onChange={(e) => setForm({ ...form, tipo_bloqueo: e.target.value })}
            >
              <option value="vacaciones">Vacaciones</option>
              <option value="incapacidad">Incapacidad</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="calibracion">Calibración</option>
              <option value="prestamo">Préstamo</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha inicio</Label>
              <Input
                type="datetime-local"
                value={form.fecha_inicio}
                onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha fin</Label>
              <Input
                type="datetime-local"
                value={form.fecha_fin}
                onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Observaciones</Label>
            <Textarea
              value={form.observaciones}
              onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              placeholder="Motivo del bloqueo..."
            />
          </div>
        </div>
      </FormDialog>
    </div>
  )
}
