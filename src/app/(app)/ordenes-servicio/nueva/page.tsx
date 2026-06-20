'use client'

import { useRouter } from 'next/navigation'
import { OrdenForm } from '@/components/ordenes/OrdenForm'
import { toast } from 'sonner'

export default function NuevaOrdenPage() {
  const router = useRouter()

  function handleSuccess() {
    toast.success('Orden de servicio creada correctamente')
    router.push('/ordenes-servicio')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Orden de Servicio</h1>
        <p className="text-muted-foreground">Completa los 3 pasos para crear una orden</p>
      </div>
      <OrdenForm onSuccess={handleSuccess} />
    </div>
  )
}
