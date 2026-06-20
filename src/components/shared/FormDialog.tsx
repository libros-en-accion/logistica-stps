'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  submitLabel?: string
  onSubmit?: () => void
  loading?: boolean
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitLabel = 'Guardar',
  onSubmit,
  loading = false,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {onSubmit && (
            <Button onClick={onSubmit} disabled={loading}>
              {loading ? 'Guardando...' : submitLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
