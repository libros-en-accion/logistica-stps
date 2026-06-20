'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RecursoCount {
  total: number
  disponibles: number
  bloqueados: number
  asignados: number
}

export function ResourceStatusPanel() {
  const [tecnicos, setTecnicos] = useState<RecursoCount | null>(null)
  const [vehiculos, setVehiculos] = useState<RecursoCount | null>(null)
  const [equipos, setEquipos] = useState<RecursoCount | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [t, v, e] = await Promise.all([
        supabase.from('tecnicos').select('id, estado').eq('activo', true),
        supabase.from('vehiculos').select('id, estado').eq('activo', true),
        supabase.from('equipos_medicion').select('id, estado').eq('activo', true),
      ])

      function contar(data: { estado: string }[]): RecursoCount {
        return {
          total: data.length,
          disponibles: data.filter((r) => r.estado === 'disponible').length,
          bloqueados: data.filter((r) => !['disponible', 'asignado'].includes(r.estado)).length,
          asignados: data.filter((r) => r.estado === 'asignado').length,
        }
      }

      if (t.data) setTecnicos(contar(t.data))
      if (v.data) setVehiculos(contar(v.data))
      if (e.data) setEquipos(contar(e.data))
    }

    load()
  }, [])

  function Semafaro({ disponibles, total }: { disponibles: number; total: number }) {
    const pct = total > 0 ? (disponibles / total) * 100 : 0
    const color = pct > 50 ? 'bg-green-500' : pct > 25 ? 'bg-yellow-500' : 'bg-red-500'

    return (
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${color}`} />
        <span className="text-sm font-medium">{disponibles}/{total}</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Estado actual de recursos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">Técnicos</p>
            <div className="flex items-center gap-4 text-sm">
              <Semafaro disponibles={tecnicos?.disponibles ?? 0} total={tecnicos?.total ?? 0} />
              <span className="text-muted-foreground">
                {tecnicos?.asignados ?? 0} asignados · {tecnicos?.bloqueados ?? 0} bloqueados
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">Vehículos</p>
            <div className="flex items-center gap-4 text-sm">
              <Semafaro disponibles={vehiculos?.disponibles ?? 0} total={vehiculos?.total ?? 0} />
              <span className="text-muted-foreground">
                {vehiculos?.asignados ?? 0} asignados · {vehiculos?.bloqueados ?? 0} bloqueados
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">Equipos</p>
            <div className="flex items-center gap-4 text-sm">
              <Semafaro disponibles={equipos?.disponibles ?? 0} total={equipos?.total ?? 0} />
              <span className="text-muted-foreground">
                {equipos?.asignados ?? 0} asignados · {equipos?.bloqueados ?? 0} bloqueados
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
