'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground">Análisis y exportación de datos</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <a href="/reportes/tecnicos" className="block">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Técnicos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Utilización, servicios por técnico, horas trabajadas
            </CardContent>
          </Card>
        </a>
        <a href="/reportes/vehiculos" className="block">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Vehículos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Kilometraje, mantenimientos, utilización de flotilla
            </CardContent>
          </Card>
        </a>
        <a href="/reportes/equipos" className="block">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Equipos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Uso por equipo, historial de calibraciones
            </CardContent>
          </Card>
        </a>
      </div>
    </div>
  )
}
