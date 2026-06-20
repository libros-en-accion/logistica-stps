import { describe, it, expect } from 'vitest'
import { tecnicoSchema } from '@/lib/schemas/tecnico.schema'
import { vehiculoSchema } from '@/lib/schemas/vehiculo.schema'
import { equipoSchema } from '@/lib/schemas/equipo.schema'
import { normaSchema } from '@/lib/schemas/norma.schema'
import { clienteSchema } from '@/lib/schemas/cliente.schema'
import { bloqueoSchema } from '@/lib/schemas/bloqueo.schema'
import { ordenServicioSchema } from '@/lib/schemas/orden-servicio.schema'

describe('Schemas Zod — Catálogos', () => {
  describe('tecnicoSchema', () => {
    it('valida un técnico completo', () => {
      const result = tecnicoSchema.safeParse({
        nombre: 'Juan',
        apellidos: 'Pérez García',
        rfc: 'PEGJ800101XXX',
        telefono: '555-1234',
        email: 'juan@test.com',
        direccion: 'Av. Reforma 123',
      })
      expect(result.success).toBe(true)
    })

    it('rechaza RFC inválido', () => {
      const result = tecnicoSchema.safeParse({
        nombre: 'Juan',
        apellidos: 'Pérez',
        rfc: 'INVALIDO',
      })
      expect(result.success).toBe(false)
    })

    it('rechaza email inválido', () => {
      const result = tecnicoSchema.safeParse({
        nombre: 'Juan',
        apellidos: 'Pérez',
        rfc: 'PEGJ800101XXX',
        email: 'no-es-email',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('vehiculoSchema', () => {
    it('valida un vehículo completo', () => {
      const result = vehiculoSchema.safeParse({
        numero_unidad: 'VH-001',
        marca: 'Toyota',
        modelo: 'Hilux',
        anio: 2023,
        placas: 'ABC-123',
      })
      expect(result.success).toBe(true)
    })

    it('rechaza año menor a 1990', () => {
      const result = vehiculoSchema.safeParse({
        numero_unidad: 'VH-001',
        marca: 'Toyota',
        modelo: 'Hilux',
        anio: 1980,
        placas: 'ABC-123',
      })
      expect(result.success).toBe(false)
    })

    it('acepta kilometraje 0', () => {
      const result = vehiculoSchema.safeParse({
        numero_unidad: 'VH-001',
        marca: 'Toyota',
        modelo: 'Hilux',
        anio: 2023,
        placas: 'ABC-123',
        km_actual: 0,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('equipoSchema', () => {
    it('valida un equipo completo', () => {
      const result = equipoSchema.safeParse({
        id_interno: 'EQ-LX-001',
        descripcion: 'Luxómetro digital',
        marca: 'Extech',
        modelo: 'LT300',
      })
      expect(result.success).toBe(true)
    })

    it('rechaza sin ID interno', () => {
      const result = equipoSchema.safeParse({
        id_interno: '',
        descripcion: 'Luxómetro',
        marca: 'Extech',
        modelo: 'LT300',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('normaSchema', () => {
    it('valida una norma activa', () => {
      const result = normaSchema.safeParse({
        clave: 'NOM-001-STPS',
        nombre: 'Edificios y centros de trabajo',
        activa: true,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('clienteSchema', () => {
    it('valida un cliente con RFC correcto', () => {
      const result = clienteSchema.safeParse({
        razon_social: 'Constructora Norte SA',
        rfc: 'CDN900101ABC',
      })
      expect(result.success).toBe(true)
    })

    it('rechaza RFC con formato inválido', () => {
      const result = clienteSchema.safeParse({
        razon_social: 'Constructora',
        rfc: 'INVALIDO',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('bloqueoSchema', () => {
    it('valida un bloqueo de técnico', () => {
      const result = bloqueoSchema.safeParse({
        tipo_recurso: 'tecnico',
        recurso_id: 'uuid-123',
        tipo_bloqueo: 'vacaciones',
        fecha_inicio: '2026-07-01T00:00:00',
        fecha_fin: '2026-07-15T23:59:59',
      })
      expect(result.success).toBe(true)
    })

    it('rechaza tipo_recurso inválido', () => {
      const result = bloqueoSchema.safeParse({
        tipo_recurso: 'otro',
        recurso_id: 'uuid-123',
        tipo_bloqueo: 'vacaciones',
        fecha_inicio: '2026-07-01',
        fecha_fin: '2026-07-15',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('ordenServicioSchema', () => {
    it('valida una OS con al menos un técnico y una norma', () => {
      const result = ordenServicioSchema.safeParse({
        cliente_id: 'cliente-uuid',
        direccion_servicio: 'Av. Reforma 100',
        fecha_inicio: '2026-07-01T08:00:00',
        fecha_fin: '2026-07-01T17:00:00',
        normas_ids: ['norma-uuid'],
        tecnicos_ids: ['tecnico-uuid'],
      })
      expect(result.success).toBe(true)
    })

    it('rechaza sin técnicos asignados', () => {
      const result = ordenServicioSchema.safeParse({
        cliente_id: 'cliente-uuid',
        direccion_servicio: 'Av. Reforma 100',
        fecha_inicio: '2026-07-01T08:00:00',
        fecha_fin: '2026-07-01T17:00:00',
        normas_ids: ['norma-uuid'],
        tecnicos_ids: [],
      })
      expect(result.success).toBe(false)
    })

    it('rechaza sin normas', () => {
      const result = ordenServicioSchema.safeParse({
        cliente_id: 'cliente-uuid',
        direccion_servicio: 'Av. Reforma 100',
        fecha_inicio: '2026-07-01T08:00:00',
        fecha_fin: '2026-07-01T17:00:00',
        normas_ids: [],
        tecnicos_ids: ['tecnico-uuid'],
      })
      expect(result.success).toBe(false)
    })
  })
})
