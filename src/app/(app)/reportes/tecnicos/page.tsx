'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReporteTecnicosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reporte de Técnicos</h1>
        <p className="text-muted-foreground">Utilización y productividad</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">Próximamente</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Reporte detallado de técnicos con exportación a CSV y PDF.
        </CardContent>
      </Card>
    </div>
  )
}
