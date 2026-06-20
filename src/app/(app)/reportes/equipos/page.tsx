'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReporteEquiposPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reporte de Equipos</h1>
        <p className="text-muted-foreground">Instrumentos y calibraciones</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">Próximamente</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Reporte detallado de equipos con exportación a CSV y PDF.
        </CardContent>
      </Card>
    </div>
  )
}
