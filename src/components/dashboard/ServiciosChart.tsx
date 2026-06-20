'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function ServiciosChart() {
  const [data, setData] = useState<{ mes: string; servicios: number }[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const seisMeses = new Date()
      seisMeses.setMonth(seisMeses.getMonth() - 6)

      const { data: ordenes } = await supabase
        .from('ordenes_servicio')
        .select('created_at')
        .gte('created_at', seisMeses.toISOString())

      if (!ordenes) return

      const meses: Record<string, number> = {}
      for (const o of ordenes) {
        const mes = new Date(o.created_at).toLocaleDateString('es-MX', {
          month: 'short',
          year: '2-digit',
        })
        meses[mes] = (meses[mes] ?? 0) + 1
      }

      setData(
        Object.entries(meses).map(([mes, servicios]) => ({ mes, servicios }))
      )
    }

    load()
  }, [])

  if (data.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Servicios por mes</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip />
          <Bar dataKey="servicios" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
