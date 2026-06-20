'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { APP_NAME } from '@/lib/constants'

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })

    if (error) {
      toast.error('Error al enviar correo', {
        description: error.message,
      })
      setLoading(false)
      return
    }

    setSent(true)
    toast.success('Correo de recuperación enviado')
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{APP_NAME}</CardTitle>
        <CardDescription>Recuperar contraseña</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {sent ? (
            <p className="text-sm text-muted-foreground text-center">
              Si el correo existe en nuestro sistema, recibirás un enlace para
              restablecer tu contraseña.
            </p>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {!sent && (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </Button>
          )}
          <Link
            href="/login"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            Volver al inicio de sesión
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
