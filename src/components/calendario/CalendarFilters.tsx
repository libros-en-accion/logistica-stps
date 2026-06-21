'use client'

export function CalendarFilters() {
  return (
    <div className="flex flex-col sm:flex-row md:flex-col gap-4 md:gap-6">
      <div className="flex-1">
        <h4 className="text-sm font-medium mb-2">Leyenda</h4>
        <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-3 md:grid-cols-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-[#3b82f6]" />
            <span>Orden programada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-[#22c55e]" />
            <span>Orden en curso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-[#10b981]" />
            <span>Orden completada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-[#f97316]" />
            <span>Vacaciones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-[#f59e0b]" />
            <span>Mantenimiento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-[#a855f7]" />
            <span>Calibración</span>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium mb-2">Tipos</h4>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p>Click en evento → ver detalle</p>
          <p>Click en día → nueva orden</p>
          <p>Arrastrar y soltar → re-programar</p>
        </div>
      </div>
    </div>
  )
}
