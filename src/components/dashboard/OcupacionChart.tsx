'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#6b7280']

export function OcupacionChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: asignaciones } = await supabase
        .from('asignaciones_tecnicos')
        .select('tecnico_id, tecnicos!inner(nombre, apellidos)')

      if (!asignaciones) return

      const conteo: Record<string, number> = {}
      for (const a of asignaciones as any[]) {
        const nombre = `${a.tecnicos?.nombre ?? ''} ${a.tecnicos?.apellidos ?? ''}`
        conteo[nombre] = (conteo[nombre] ?? 0) + 1
      }

      setData(
        Object.entries(conteo)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
      )
    }

    load()
  }, [])

  if (data.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Servicios por técnico</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
            labelLine
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
