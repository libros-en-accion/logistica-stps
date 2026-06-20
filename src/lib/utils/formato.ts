/**
 * Convierte valores null a undefined para compatibilidad con Zod forms.
 * Úsalo para pasar datos de BD a formularios Zod: defaultValues={nullToUndefined(record)}
 */
export function nullToUndefined<T extends Record<string, unknown>>(obj: T | null | undefined): Partial<T> | undefined {
  if (obj == null) return undefined
  if (typeof obj !== 'object') return obj as unknown as Partial<T>
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v])
  ) as Partial<T>
}
