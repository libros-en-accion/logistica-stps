'use client'

import { StatsCards } from '@/components/dashboard/StatsCards'
import { ServiciosChart } from '@/components/dashboard/ServiciosChart'
import { OcupacionChart } from '@/components/dashboard/OcupacionChart'
import { AlertasList } from '@/components/dashboard/AlertasList'
import { ActividadReciente } from '@/components/dashboard/ActividadReciente'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen operativo del sistema STPS Logística</p>
      </div>

      <StatsCards />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiciosChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución</CardTitle>
          </CardHeader>
          <CardContent>
            <OcupacionChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertasList />
            <div className="mt-4 text-center text-xs text-muted-foreground">
              {AlertasList.length === 0 && 'No hay alertas activas'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <ActividadReciente />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
