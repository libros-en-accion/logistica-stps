'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'
import type { PerfilUsuario } from '@/types/database.types'

export function useAuth() {
  const { user, isLoading, isAuthenticated, setUser, setLoading, reset } =
    useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: perfil } = await supabase
          .from('perfiles_usuario')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (perfil) {
          setUser(perfil as PerfilUsuario)
        }
      } else {
        reset()
      }
    })

    // Cargar sesión inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: perfil } = await supabase
          .from('perfiles_usuario')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (perfil) {
          setUser(perfil as PerfilUsuario)
        } else {
          reset()
        }
      } else {
        reset()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function register(email: string, password: string, nombreCompleto: string, rol: PerfilUsuario['rol']) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre_completo: nombreCompleto, rol } },
    })
    if (data.user) {
      // Crear perfil automáticamente (el trigger RLS lo maneja)
      await supabase.from('perfiles_usuario').insert({
        id: data.user.id,
        nombre_completo: nombreCompleto,
        rol,
      })
    }
    return { error }
  }

  async function logout() {
    await supabase.auth.signOut()
    reset()
  }

  function hasRole(...roles: PerfilUsuario['rol'][]) {
    return user ? roles.includes(user.rol) : false
  }

  function isAdmin() {
    return user?.rol === 'admin'
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
  }
}
