'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface OSDetalle {
  id: string
  folio: string
  fecha_inicio: string
  fecha_fin: string
  estado: string
  direccion_servicio: string
  observaciones: string | null
  created_at: string
}

export default function DetalleOrdenPage({ params }: { params: { id: string } }) {
  const [os, setOs] = useState<OSDetalle | null>(null)
  const [cliente, setCliente] = useState<any>(null)
  const [tecnicos, setTecnicos] = useState<any[]>([])
  const [vehiculos, setVehiculos] = useState<any[]>([])
  const [equipos, setEquipos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: orden } = await supabase
        .from('ordenes_servicio')
        .select('*, clientes!inner(id, razon_social, rfc, direccion)')
        .eq('id', params.id)
        .single()

      if (!orden) {
        setLoading(false)
        return
      }

      setOs(orden as any)
      setCliente((orden as any).clientes)

      const [t, v, e] = await Promise.all([
        supabase.from('asignaciones_tecnicos').select('tecnico_id, tecnicos!inner(id, nombre, apellidos, rfc)').eq('orden_servicio_id', params.id),
        supabase.from('asignaciones_vehiculos').select('vehiculo_id, vehiculos!inner(id, numero_unidad, marca, modelo, placas)').eq('orden_servicio_id', params.id),
        supabase.from('asignaciones_equipos').select('equipo_id, equipos_medicion!inner(id, id_interno, descripcion, vigencia_calibracion)').eq('orden_servicio_id', params.id),
      ])

      setTecnicos((t.data ?? []).map((r: any) => r.tecnicos))
      setVehiculos((v.data ?? []).map((r: any) => r.vehiculos))
      setEquipos((e.data ?? []).map((r: any) => r.equipos_medicion))
      setLoading(false)
    }

    load()
  }, [params.id, supabase])

  async function handleCambiarEstado(nuevoEstado: string) {
    const { error } = await supabase
      .from('ordenes_servicio')
      .update({ estado: nuevoEstado })
      .eq('id', params.id)

    if (error) {
      toast.error('Error al actualizar estado')
      return
    }

    toast.success(`Orden actualizada a ${nuevoEstado}`)
    setOs((prev) => prev ? { ...prev, estado: nuevoEstado } : prev)
    router.refresh()
  }

  if (loading) return <p className="text-muted-foreground">Cargando...</p>
  if (!os) return <p className="text-destructive">Orden no encontrada</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ordenes-servicio">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{os.folio}</h1>
            <StatusBadge status={os.estado} />
          </div>
          <p className="text-muted-foreground">Creada {new Date(os.created_at).toLocaleDateString('es-MX')}</p>
        </div>
        <div className="flex gap-2">
          {os.estado === 'programada' && (
            <Button onClick={() => handleCambiarEstado('en_curso')}>
              <CheckCircle className="mr-1 h-4 w-4" /> Iniciar
            </Button>
          )}
          {os.estado === 'en_curso' && (
            <Button onClick={() => handleCambiarEstado('completada')}>
              <CheckCircle className="mr-1 h-4 w-4" /> Completar
            </Button>
          )}
          {['borrador', 'programada'].includes(os.estado) && (
            <Button variant="destructive" onClick={() => handleCambiarEstado('cancelada')}>
              <XCircle className="mr-1 h-4 w-4" /> Cancelar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información general</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Cliente:</strong> {cliente?.razon_social ?? '-'}</p>
            <p><strong>RFC:</strong> {cliente?.rfc ?? '-'}</p>
            <p><strong>Dirección del servicio:</strong> {os.direccion_servicio}</p>
            <p><strong>Inicio:</strong> {new Date(os.fecha_inicio).toLocaleString('es-MX')}</p>
            <p><strong>Fin:</strong> {new Date(os.fecha_fin).toLocaleString('es-MX')}</p>
            {os.observaciones && <p><strong>Observaciones:</strong> {os.observaciones}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recursos asignados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-1">Técnicos</p>
              {tecnicos.length === 0 ? (
                <p className="text-muted-foreground">Sin asignar</p>
              ) : (
                tecnicos.map((t) => (
                  <Badge key={t.id} variant="secondary" className="mr-1 mb-1">
                    {t.nombre} {t.apellidos}
                  </Badge>
                ))
              )}
            </div>
            <div>
              <p className="font-medium mb-1">Vehículos</p>
              {vehiculos.length === 0 ? (
                <p className="text-muted-foreground">Sin asignar</p>
              ) : (
                vehiculos.map((v) => (
                  <Badge key={v.id} variant="secondary" className="mr-1 mb-1">
                    {v.numero_unidad} ({v.marca} {v.modelo})
                  </Badge>
                ))
              )}
            </div>
            <div>
              <p className="font-medium mb-1">Equipos</p>
              {equipos.length === 0 ? (
                <p className="text-muted-foreground">Sin asignar</p>
              ) : (
                equipos.map((e) => (
                  <Badge key={e.id} variant="secondary" className="mr-1 mb-1">
                    {e.id_interno} - {e.descripcion}
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
