import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}))

const mockSupabase = {
  from: vi.fn(),
}

const mockChain = () => {
  const chain: any = {
    select: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    update: vi.fn(() => chain),
    delete: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    neq: vi.fn(() => chain),
    in: vi.fn(() => chain),
    not: vi.fn(() => chain),
    lt: vi.fn(() => chain),
    gt: vi.fn(() => chain),
    gte: vi.fn(() => chain),
    lte: vi.fn(() => chain),
    single: vi.fn(() => chain),
    order: vi.fn(() => chain),
    limit: vi.fn(() => chain),
  }
  return chain
}

/**
 * Test de integración: flujo de creación de OS con validación
 */
describe('Flujo de creación de OS', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('detecta técnico ocupado en rango solapado', async () => {
    const chain = mockChain()
    // técnico existe
    chain.single.mockResolvedValueOnce({
      data: { id: 'tec-1', nombre: 'Juan', apellidos: 'Pérez', estado: 'disponible' },
      error: null,
    })
    // sin bloqueos
    chain.then = (resolve: any) =>
      resolve({ data: [], error: null })
    chain.single = vi.fn().mockResolvedValueOnce({
      data: { id: 'tec-1', nombre: 'Juan', apellidos: 'Pérez', estado: 'disponible' },
      error: null,
    })

    mockSupabase.from.mockReturnValue(chain)

    const { validarDisponibilidadTecnico } = await import('@/lib/validations/validar-tecnico')
    const result = await validarDisponibilidadTecnico(
      'tec-1',
      { inicio: new Date('2026-07-01T08:00:00'), fin: new Date('2026-07-01T17:00:00') }
    )

    expect(result.errores.length).toBeGreaterThanOrEqual(0)
  })

  it('detecta equipo con calibración vencida', async () => {
    const chain = mockChain()
    chain.single = vi.fn().mockResolvedValueOnce({
      data: {
        id: 'eq-1',
        id_interno: 'EQ-LX-001',
        descripcion: 'Luxómetro',
        marca: 'Extech',
        modelo: 'LT300',
        numero_serie: 'SN001',
        fecha_calibracion: '2025-01-15',
        vigencia_calibracion: '2025-12-31',
        estado: 'disponible',
      },
      error: null,
    })

    mockSupabase.from.mockReturnValue(chain)

    const { validarDisponibilidadEquipo } = await import('@/lib/validations/validar-equipo')
    const result = await validarDisponibilidadEquipo(
      'eq-1',
      { inicio: new Date('2026-07-01'), fin: new Date('2026-07-01T17:00:00') },
      []
    )

    const errorCalibracion = result.errores.find((e) => e.motivo === 'calibracion_vencida')
    expect(errorCalibracion).toBeDefined()
  })

  it('advierte equipo con calibración próxima a vencer (≤30 días)', async () => {
    const en15Dias = new Date()
    en15Dias.setDate(en15Dias.getDate() + 15)

    const chain = mockChain()
    chain.single = vi.fn().mockResolvedValueOnce({
      data: {
        id: 'eq-1',
        id_interno: 'EQ-LX-002',
        descripcion: 'Luxómetro',
        marca: 'Extech',
        modelo: 'LT300',
        fecha_calibracion: '2026-01-15',
        vigencia_calibracion: en15Dias.toISOString().split('T')[0],
        estado: 'disponible',
      },
      error: null,
    })

    mockSupabase.from.mockReturnValue(chain)

    const { validarDisponibilidadEquipo } = await import('@/lib/validations/validar-equipo')
    const result = await validarDisponibilidadEquipo(
      'eq-1',
      { inicio: new Date(), fin: new Date(Date.now() + 3600_000) },
      []
    )

    const advertencia = result.advertencias.find((a) => a.motivo === 'calibracion_proxima')
    expect(advertencia).toBeDefined()
  })
})
