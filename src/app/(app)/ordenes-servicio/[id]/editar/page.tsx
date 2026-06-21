'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OrdenForm } from '@/components/ordenes/OrdenForm'
import { toast } from 'sonner'

export default function EditarOrdenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/ordenes-servicio/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Orden de Servicio</h1>
          <p className="text-muted-foreground">Modifica la información y asignación de recursos</p>
        </div>
      </div>

      <OrdenForm
        ordenId={id}
        onSuccess={() => {
          toast.success('Orden de servicio actualizada correctamente')
          router.push(`/ordenes-servicio/${id}`)
          router.refresh()
        }}
      />
    </div>
  )
}
