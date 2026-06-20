import { create } from 'zustand'
import type { PerfilUsuario } from '@/types/database.types'

interface AuthState {
  user: PerfilUsuario | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: PerfilUsuario | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () =>
    set({ user: null, isAuthenticated: false, isLoading: false }),
}))
