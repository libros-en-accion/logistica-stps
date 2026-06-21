-- Fase 1, Tarea 1.6: Funciones PostgreSQL para validación de conflictos

-- Función para verificar disponibilidad de técnico en rango de fechas
CREATE OR REPLACE FUNCTION fn_verificar_disponibilidad_tecnico(
  p_tecnico_id UUID,
  p_fecha_inicio TIMESTAMPTZ,
  p_fecha_fin TIMESTAMPTZ,
  p_orden_id UUID DEFAULT NULL
)
RETURNS TABLE(
  disponible BOOLEAN,
  motivo TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_conflicto_os UUID;
  v_conflicto_bloqueo UUID;
BEGIN
  -- Verificar contra asignaciones existentes (excluir orden actual si se proporciona)
  SELECT at.orden_servicio_id INTO v_conflicto_os
  FROM asignaciones_tecnicos at
  JOIN ordenes_servicio os ON os.id = at.orden_servicio_id
  WHERE at.tecnico_id = p_tecnico_id
    AND os.estado NOT IN ('cancelada', 'completada')
    AND (p_orden_id IS NULL OR os.id != p_orden_id)
    AND os.fecha_inicio < p_fecha_fin + INTERVAL '1 hour'
    AND os.fecha_fin > p_fecha_inicio - INTERVAL '1 hour'
  LIMIT 1;

  IF v_conflicto_os IS NOT NULL THEN
    RETURN QUERY SELECT false, 'Técnico ya asignado o en traslado para orden de servicio ' || v_conflicto_os;
    RETURN;
  END IF;

  -- Verificar contra bloqueos activos
  SELECT id INTO v_conflicto_bloqueo
  FROM bloqueos_recursos
  WHERE tipo_recurso = 'tecnico'
    AND recurso_id = p_tecnico_id
    AND fecha_inicio < p_fecha_fin
    AND fecha_fin > p_fecha_inicio
  LIMIT 1;

  IF v_conflicto_bloqueo IS NOT NULL THEN
    RETURN QUERY SELECT false, 'Técnico con bloqueo activo ' || v_conflicto_bloqueo;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, NULL::TEXT;
END;
$$;

-- Función para verificar disponibilidad de vehículo en rango de fechas
CREATE OR REPLACE FUNCTION fn_verificar_disponibilidad_vehiculo(
  p_vehiculo_id UUID,
  p_fecha_inicio TIMESTAMPTZ,
  p_fecha_fin TIMESTAMPTZ,
  p_orden_id UUID DEFAULT NULL
)
RETURNS TABLE(
  disponible BOOLEAN,
  motivo TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_conflicto_os UUID;
  v_conflicto_bloqueo UUID;
BEGIN
  -- Verificar contra asignaciones existentes
  SELECT av.orden_servicio_id INTO v_conflicto_os
  FROM asignaciones_vehiculos av
  JOIN ordenes_servicio os ON os.id = av.orden_servicio_id
  WHERE av.vehiculo_id = p_vehiculo_id
    AND os.estado NOT IN ('cancelada', 'completada')
    AND (p_orden_id IS NULL OR os.id != p_orden_id)
    AND os.fecha_inicio < p_fecha_fin
    AND os.fecha_fin > p_fecha_inicio
  LIMIT 1;

  IF v_conflicto_os IS NOT NULL THEN
    RETURN QUERY SELECT false, 'Vehículo ya asignado a orden de servicio ' || v_conflicto_os;
    RETURN;
  END IF;

  -- Verificar contra bloqueos activos
  SELECT id INTO v_conflicto_bloqueo
  FROM bloqueos_recursos
  WHERE tipo_recurso = 'vehiculo'
    AND recurso_id = p_vehiculo_id
    AND fecha_inicio < p_fecha_fin
    AND fecha_fin > p_fecha_inicio
  LIMIT 1;

  IF v_conflicto_bloqueo IS NOT NULL THEN
    RETURN QUERY SELECT false, 'Vehículo con bloqueo activo ' || v_conflicto_bloqueo;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, NULL::TEXT;
END;
$$;

-- Función para verificar disponibilidad de equipo en rango de fechas
CREATE OR REPLACE FUNCTION fn_verificar_disponibilidad_equipo(
  p_equipo_id UUID,
  p_fecha_inicio TIMESTAMPTZ,
  p_fecha_fin TIMESTAMPTZ,
  p_orden_id UUID DEFAULT NULL
)
RETURNS TABLE(
  disponible BOOLEAN,
  motivo TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_conflicto_os UUID;
  v_conflicto_bloqueo UUID;
  v_vigencia DATE;
BEGIN
  -- Verificar vigencia de calibración
  SELECT vigencia_calibracion INTO v_vigencia
  FROM equipos_medicion
  WHERE id = p_equipo_id;

  IF v_vigencia IS NOT NULL AND v_vigencia < p_fecha_inicio::DATE THEN
    RETURN QUERY SELECT false, 'Calibración del equipo vencida (vigencia: ' || v_vigencia || ')';
    RETURN;
  END IF;

  -- Verificar contra asignaciones existentes
  SELECT ae.orden_servicio_id INTO v_conflicto_os
  FROM asignaciones_equipos ae
  JOIN ordenes_servicio os ON os.id = ae.orden_servicio_id
  WHERE ae.equipo_id = p_equipo_id
    AND os.estado NOT IN ('cancelada', 'completada')
    AND (p_orden_id IS NULL OR os.id != p_orden_id)
    AND os.fecha_inicio < p_fecha_fin
    AND os.fecha_fin > p_fecha_inicio
  LIMIT 1;

  IF v_conflicto_os IS NOT NULL THEN
    RETURN QUERY SELECT false, 'Equipo ya asignado a orden de servicio ' || v_conflicto_os;
    RETURN;
  END IF;

  -- Verificar contra bloqueos activos
  SELECT id INTO v_conflicto_bloqueo
  FROM bloqueos_recursos
  WHERE tipo_recurso = 'equipo'
    AND recurso_id = p_equipo_id
    AND fecha_inicio < p_fecha_fin
    AND fecha_fin > p_fecha_inicio
  LIMIT 1;

  IF v_conflicto_bloqueo IS NOT NULL THEN
    RETURN QUERY SELECT false, 'Equipo con bloqueo activo ' || v_conflicto_bloqueo;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, NULL::TEXT;
END;
$$;

-- Función para verificar vigencia de calibración de equipo
CREATE OR REPLACE FUNCTION fn_verificar_vigencia_calibracion(
  p_equipo_id UUID,
  p_fecha_servicio DATE
)
RETURNS TABLE(
  vigente BOOLEAN,
  dias_restantes INTEGER,
  motivo TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_vigencia DATE;
BEGIN
  SELECT vigencia_calibracion INTO v_vigencia
  FROM equipos_medicion
  WHERE id = p_equipo_id;

  IF v_vigencia IS NULL THEN
    RETURN QUERY SELECT false, NULL::INTEGER, 'Equipo sin calibración registrada';
    RETURN;
  END IF;

  IF v_vigencia < p_fecha_servicio THEN
    RETURN QUERY SELECT false, (v_vigencia - p_fecha_servicio), 'Calibración vencida';
    RETURN;
  END IF;

  RETURN QUERY SELECT true, (v_vigencia - p_fecha_servicio), 'Calibración vigente';
END;
$$;

-- Función para generar folio automático de orden de servicio
CREATE OR REPLACE FUNCTION fn_generar_folio()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_folio TEXT;
  v_anio TEXT;
  v_mes TEXT;
  v_consecutivo INTEGER;
BEGIN
  v_anio := TO_CHAR(now(), 'YYYY');
  v_mes := TO_CHAR(now(), 'MM');

  -- Obtener consecutivo del mes actual
  SELECT COUNT(*) + 1 INTO v_consecutivo
  FROM ordenes_servicio
  WHERE folio LIKE 'OS-' || v_anio || v_mes || '-%';

  v_folio := 'OS-' || v_anio || v_mes || '-' || LPAD(v_consecutivo::TEXT, 4, '0');

  RETURN v_folio;
END;
$$;
