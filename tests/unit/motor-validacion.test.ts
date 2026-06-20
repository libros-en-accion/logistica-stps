import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}))

const mockSupabase = {
  from: vi.fn(() => mockQuery),
}

const mockQuery = {
  select: vi.fn(() => mockQuery),
  insert: vi.fn(() => mockQuery),
  update: vi.fn(() => mockQuery),
  delete: vi.fn(() => mockQuery),
  eq: vi.fn(() => mockQuery),
  neq: vi.fn(() => mockQuery),
  in: vi.fn(() => mockQuery),
  not: vi.fn(() => mockQuery),
  lt: vi.fn(() => mockQuery),
  gt: vi.fn(() => mockQuery),
  gte: vi.fn(() => mockQuery),
  single: vi.fn(() => mockQuery),
  order: vi.fn(() => mockQuery),
  limit: vi.fn(() => mockQuery),
  count: null,
}

describe('Motor de Validación - Funciones internas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('tipos.ts', () => {
    it('debe tener la estructura correcta para ConflictoDetectado', () => {
      const conflicto: import('@/lib/validations/tipos').ConflictoDetectado = {
        tipo: 'tecnico',
        recurso_id: 'abc-123',
        recurso_nombre: 'Juan Pérez',
        motivo: 'ocupado',
        detalle: 'Ya asignado a otra orden',
      }
      expect(conflicto.tipo).toBe('tecnico')
      expect(conflicto.motivo).toBe('ocupado')
    })

    it('debe tener la estructura correcta para ValidacionResult', () => {
      const result: import('@/lib/validations/tipos').ValidacionResult = {
        valido: true,
        errores: [],
        advertencias: [],
      }
      expect(result.valido).toBe(true)
      expect(result.errores).toHaveLength(0)
    })
  })

  describe('validar-tecnico.ts', () => {
    it('debe retornar no disponible si el técnico no existe', async () => {
      mockSupabase.from.mockReturnValue({
        ...mockQuery,
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      })

      const { validarDisponibilidadTecnico } = await import('@/lib/validations/validar-tecnico')
      const result = await validarDisponibilidadTecnico(
        'no-existe',
        { inicio: new Date('2026-07-01'), fin: new Date('2026-07-01T17:00:00') }
      )

      expect(result.disponible).toBe(false)
      expect(result.errores.length).toBeGreaterThan(0)
      expect(result.errores[0].motivo).toBe('ocupado')
    })
  })

  describe('validar-vehiculo.ts', () => {
    it('debe retornar no disponible si el vehículo no existe', async () => {
      mockSupabase.from.mockReturnValue({
        ...mockQuery,
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      })

      const { validarDisponibilidadVehiculo } = await import('@/lib/validations/validar-vehiculo')
      const result = await validarDisponibilidadVehiculo(
        'no-existe',
        { inicio: new Date('2026-07-01'), fin: new Date('2026-07-01T17:00:00') }
      )

      expect(result.disponible).toBe(false)
    })
  })

  describe('validar-equipo.ts', () => {
    it('debe retornar no disponible si el equipo no existe', async () => {
      mockSupabase.from.mockReturnValue({
        ...mockQuery,
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      })

      const { validarDisponibilidadEquipo } = await import('@/lib/validations/validar-equipo')
      const result = await validarDisponibilidadEquipo(
        'no-existe',
        { inicio: new Date('2026-07-01'), fin: new Date('2026-07-01T17:00:00') },
        []
      )

      expect(result.disponible).toBe(false)
    })
  })
})
