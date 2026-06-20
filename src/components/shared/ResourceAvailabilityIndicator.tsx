'use client'

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ResourceAvailabilityIndicatorProps {
  status: 'disponible' | 'advertencia' | 'no_disponible' | 'informacion'
  label: string
  tooltip: string
  className?: string
}

const config = {
  disponible: { icon: '🟢', className: 'text-green-600' },
  advertencia: { icon: '🟡', className: 'text-yellow-600' },
  no_disponible: { icon: '🔴', className: 'text-red-600' },
  informacion: { icon: '🔵', className: 'text-blue-600' },
}

export function ResourceAvailabilityIndicator({
  status,
  label,
  tooltip,
  className,
}: ResourceAvailabilityIndicatorProps) {
  const c = config[status]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 text-sm cursor-help',
              c.className,
              className
            )}
          >
            <span className="text-base leading-none">{c.icon}</span>
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
