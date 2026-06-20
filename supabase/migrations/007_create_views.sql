-- Fase 1, Tarea 1.8: Vistas materializadas para consultas frecuentes

-- Vista consolidada para el calendario
CREATE MATERIALIZED VIEW vista_calendario_recursos AS
SELECT
  os.id AS orden_id,
  os.folio,
  os.fecha_inicio,
  os.fecha_fin,
  os.estado AS estado_orden,
  c.razon_social AS cliente,
  c.rfc AS cliente_rfc,
  ARRAY_AGG(DISTINCT t.nombre || ' ' || t.apellidos) FILTER (WHERE t.id IS NOT NULL) AS tecnicos,
  ARRAY_AGG(DISTINCT v.numero_unidad || ' (' || v.placas || ')') FILTER (WHERE v.id IS NOT NULL) AS vehiculos,
  ARRAY_AGG(DISTINCT e.id_interno || ' - ' || e.descripcion) FILTER (WHERE e.id IS NOT NULL) AS equipos,
  ARRAY_AGG(DISTINCT n.clave || ' - ' || n.nombre) FILTER (WHERE n.id IS NOT NULL) AS normas
FROM ordenes_servicio os
LEFT JOIN clientes c ON c.id = os.cliente_id
LEFT JOIN asignaciones_tecnicos at ON at.orden_servicio_id = os.id
LEFT JOIN tecnicos t ON t.id = at.tecnico_id
LEFT JOIN asignaciones_vehiculos av ON av.orden_servicio_id = os.id
LEFT JOIN vehiculos v ON v.id = av.vehiculo_id
LEFT JOIN asignaciones_equipos ae ON ae.orden_servicio_id = os.id
LEFT JOIN equipos_medicion e ON e.id = ae.equipo_id
LEFT JOIN ordenes_normas on2 ON on2.orden_servicio_id = os.id
LEFT JOIN normas_stps n ON n.id = on2.norma_id
WHERE os.estado NOT IN ('cancelada')
GROUP BY os.id, os.folio, os.fecha_inicio, os.fecha_fin, os.estado, c.razon_social, c.rfc
ORDER BY os.fecha_inicio;

-- Índice para refrescar la vista materializada
CREATE INDEX idx_vista_calendario_fechas ON vista_calendario_recursos(fecha_inicio, fecha_fin);

-- Vista de disponibilidad diaria por recurso
CREATE MATERIALIZED VIEW vista_disponibilidad_diaria AS
WITH fechas AS (
  SELECT generate_series(
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '90 days',
    INTERVAL '1 day'
  )::DATE AS fecha
),
tecnicos_disponibles AS (
  SELECT
    f.fecha,
    COUNT(DISTINCT t.id) AS total_tecnicos,
    COUNT(DISTINCT t.id) - COUNT(DISTINCT at.tecnico_id) AS disponibles
  FROM fechas f
  CROSS JOIN tecnicos t
  LEFT JOIN asignaciones_tecnicos at ON at.tecnico_id = t.id
  LEFT JOIN ordenes_servicio os ON os.id = at.orden_servicio_id
    AND os.fecha_inicio::DATE <= f.fecha
    AND os.fecha_fin::DATE >= f.fecha
    AND os.estado NOT IN ('cancelada', 'completada')
  WHERE t.activo = true
  GROUP BY f.fecha
),
vehiculos_disponibles AS (
  SELECT
    f.fecha,
    COUNT(DISTINCT v.id) AS total_vehiculos,
    COUNT(DISTINCT v.id) - COUNT(DISTINCT av.vehiculo_id) AS disponibles
  FROM fechas f
  CROSS JOIN vehiculos v
  LEFT JOIN asignaciones_vehiculos av ON av.vehiculo_id = v.id
  LEFT JOIN ordenes_servicio os ON os.id = av.orden_servicio_id
    AND os.fecha_inicio::DATE <= f.fecha
    AND os.fecha_fin::DATE >= f.fecha
    AND os.estado NOT IN ('cancelada', 'completada')
  WHERE v.activo = true
  GROUP BY f.fecha
),
equipos_disponibles AS (
  SELECT
    f.fecha,
    COUNT(DISTINCT e.id) AS total_equipos,
    COUNT(DISTINCT e.id) - COUNT(DISTINCT ae.equipo_id) AS disponibles
  FROM fechas f
  CROSS JOIN equipos_medicion e
  LEFT JOIN asignaciones_equipos ae ON ae.equipo_id = e.id
  LEFT JOIN ordenes_servicio os ON os.id = ae.orden_servicio_id
    AND os.fecha_inicio::DATE <= f.fecha
    AND os.fecha_fin::DATE >= f.fecha
    AND os.estado NOT IN ('cancelada', 'completada')
  WHERE e.activo = true
  GROUP BY f.fecha
)
SELECT
  f.fecha,
  td.total_tecnicos,
  td.disponibles AS tecnicos_disponibles,
  vd.total_vehiculos,
  vd.disponibles AS vehiculos_disponibles,
  ed.total_equipos,
  ed.disponibles AS equipos_disponibles
FROM fechas f
LEFT JOIN tecnicos_disponibles td ON td.fecha = f.fecha
LEFT JOIN vehiculos_disponibles vd ON vd.fecha = f.fecha
LEFT JOIN equipos_disponibles ed ON ed.fecha = f.fecha
ORDER BY f.fecha;

-- Índice para búsqueda rápida en vista de disponibilidad
CREATE INDEX idx_vista_disponibilidad_fecha ON vista_disponibilidad_diaria(fecha);

-- Función para refrescar vistas materializadas
CREATE OR REPLACE FUNCTION fn_refrescar_vistas()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY vista_calendario_recursos;
  REFRESH MATERIALIZED VIEW CONCURRENTLY vista_disponibilidad_diaria;
END;
$$;
