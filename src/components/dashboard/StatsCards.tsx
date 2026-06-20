'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { KPICard } from '@/components/dashboard/KPICard'
import { CalendarDays, Users, Truck, Wrench } from 'lucide-react'

interface Stats {
  hoy: number
  semana: number
  tecnicosDisponibles: number
  tecnicosTotal: number
  vehiculosDisponibles: number
  vehiculosTotal: number
  equiposDisponibles: number
  equiposTotal: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    hoy: 0, semana: 0,
    tecnicosDisponibles: 0, tecnicosTotal: 0,
    vehiculosDisponibles: 0, vehiculosTotal: 0,
    equiposDisponibles: 0, equiposTotal: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      const manana = new Date(hoy)
      manana.setDate(manana.getDate() + 1)
      const inicioSemana = new Date(hoy)
      inicioSemana.setDate(hoy.getDate() - hoy.getDay())
      const finSemana = new Date(inicioSemana)
      finSemana.setDate(inicioSemana.getDate() + 7)

      const [
        { count: hoyCount },
        { count: semanaCount },
        tec,
        veh,
        eq,
      ] = await Promise.all([
        supabase.from('ordenes_servicio').select('*', { count: 'exact', head: true })
          .gte('fecha_inicio', hoy.toISOString())
          .lt('fecha_inicio', manana.toISOString()),
        supabase.from('ordenes_servicio').select('*', { count: 'exact', head: true })
          .gte('fecha_inicio', inicioSemana.toISOString())
          .lt('fecha_inicio', finSemana.toISOString()),
        supabase.from('tecnicos').select('id, estado').eq('activo', true),
        supabase.from('vehiculos').select('id, estado').eq('activo', true),
        supabase.from('equipos_medicion').select('id, estado').eq('activo', true),
      ])

      setStats({
        hoy: hoyCount ?? 0,
        semana: semanaCount ?? 0,
        tecnicosDisponibles: (tec.data ?? []).filter((t) => t.estado === 'disponible').length,
        tecnicosTotal: (tec.data ?? []).length,
        vehiculosDisponibles: (veh.data ?? []).filter((v) => v.estado === 'disponible').length,
        vehiculosTotal: (veh.data ?? []).length,
        equiposDisponibles: (eq.data ?? []).filter((e) => e.estado === 'disponible').length,
        equiposTotal: (eq.data ?? []).length,
      })
    }

    load()
  }, [])

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Servicios hoy"
        value={stats.hoy}
        icon={<CalendarDays className="h-4 w-4" />}
      />
      <KPICard
        title="Esta semana"
        value={stats.semana}
        icon={<CalendarDays className="h-4 w-4" />}
      />
      <KPICard
        title="Técnicos disponibles"
        value={`${stats.tecnicosDisponibles}/${stats.tecnicosTotal}`}
        icon={<Users className="h-4 w-4" />}
        description={`${stats.tecnicosTotal - stats.tecnicosDisponibles} no disponibles`}
      />
      <KPICard
        title="Vehículos disponibles"
        value={`${stats.vehiculosDisponibles}/${stats.vehiculosTotal}`}
        icon={<Truck className="h-4 w-4" />}
        description={`${stats.vehiculosTotal - stats.vehiculosDisponibles} no disponibles`}
      />
    </div>
  )
}
