-- Fase 1, Tarea 1.7: Triggers de auditoría y validación

-- Trigger genérico para auditoría
CREATE OR REPLACE FUNCTION fn_auditoria_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_data JSONB;
  v_new_data JSONB;
  v_action accion_auditoria;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_old_data := to_jsonb(OLD);
    v_new_data := NULL;
    v_action := 'DELETE';
  ELSIF TG_OP = 'UPDATE' THEN
    v_old_data := to_jsonb(OLD);
    v_new_data := to_jsonb(NEW);
    v_action := 'UPDATE';
  ELSE
    v_old_data := NULL;
    v_new_data := to_jsonb(NEW);
    v_action := 'INSERT';
  END IF;

  INSERT INTO historial_cambios (
    tabla_afectada,
    registro_id,
    accion,
    datos_anteriores,
    datos_nuevos,
    usuario_id
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(
      CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
      gen_random_uuid()
    ),
    v_action,
    v_old_data,
    v_new_data,
    auth.uid()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Aplicar triggers de auditoría a todas las tablas principales
CREATE TRIGGER trg_auditoria_clientes
  AFTER INSERT OR UPDATE OR DELETE ON clientes
  FOR EACH ROW EXECUTE FUNCTION fn_auditoria_trigger();

CREATE TRIGGER trg_auditoria_normas
  AFTER INSERT OR UPDATE OR DELETE ON normas_stps
  FOR EACH ROW EXECUTE FUNCTION fn_auditoria_trigger();

CREATE TRIGGER trg_auditoria_tecnicos
  AFTER INSERT OR UPDATE OR DELETE ON tecnicos
  FOR EACH ROW EXECUTE FUNCTION fn_auditoria_trigger();

CREATE TRIGGER trg_auditoria_vehiculos
  AFTER INSERT OR UPDATE OR DELETE ON vehiculos
  FOR EACH ROW EXECUTE FUNCTION fn_auditoria_trigger();

CREATE TRIGGER trg_auditoria_equipos
  AFTER INSERT OR UPDATE OR DELETE ON equipos_medicion
  FOR EACH ROW EXECUTE FUNCTION fn_auditoria_trigger();

CREATE TRIGGER trg_auditoria_ordenes
  AFTER INSERT OR UPDATE OR DELETE ON ordenes_servicio
  FOR EACH ROW EXECUTE FUNCTION fn_auditoria_trigger();

CREATE TRIGGER trg_auditoria_bloqueos
  AFTER INSERT OR UPDATE OR DELETE ON bloqueos_recursos
  FOR EACH ROW EXECUTE FUNCTION fn_auditoria_trigger();

-- Aplicar triggers de updated_at
CREATE TRIGGER trg_updated_at_perfiles
  BEFORE UPDATE ON perfiles_usuario
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_updated_at_clientes
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_updated_at_normas
  BEFORE UPDATE ON normas_stps
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_updated_at_tecnicos
  BEFORE UPDATE ON tecnicos
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_updated_at_vehiculos
  BEFORE UPDATE ON vehiculos
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_updated_at_equipos
  BEFORE UPDATE ON equipos_medicion
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_updated_at_ordenes
  BEFORE UPDATE ON ordenes_servicio
  FOR EACH ROW EXECUTE FUNCTION fn_update_updated_at();

-- Trigger para validación de conflictos al insertar asignaciones
CREATE OR REPLACE FUNCTION fn_validar_asignacion_tecnico()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_disponible BOOLEAN;
  v_motivo TEXT;
  v_fecha_inicio TIMESTAMPTZ;
  v_fecha_fin TIMESTAMPTZ;
BEGIN
  SELECT fecha_inicio, fecha_fin INTO v_fecha_inicio, v_fecha_fin
  FROM ordenes_servicio
  WHERE id = NEW.orden_servicio_id;

  SELECT disponible, motivo INTO v_disponible, v_motivo
  FROM public.fn_verificar_disponibilidad_tecnico(
    NEW.tecnico_id,
    v_fecha_inicio,
    v_fecha_fin,
    NEW.orden_servicio_id
  );

  IF NOT v_disponible THEN
    RAISE EXCEPTION 'Conflicto de disponibilidad: %', v_motivo;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validar_asignacion_tecnico
  BEFORE INSERT ON asignaciones_tecnicos
  FOR EACH ROW EXECUTE FUNCTION fn_validar_asignacion_tecnico();

CREATE OR REPLACE FUNCTION fn_validar_asignacion_vehiculo()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_disponible BOOLEAN;
  v_motivo TEXT;
  v_fecha_inicio TIMESTAMPTZ;
  v_fecha_fin TIMESTAMPTZ;
BEGIN
  SELECT fecha_inicio, fecha_fin INTO v_fecha_inicio, v_fecha_fin
  FROM ordenes_servicio
  WHERE id = NEW.orden_servicio_id;

  SELECT disponible, motivo INTO v_disponible, v_motivo
  FROM public.fn_verificar_disponibilidad_vehiculo(
    NEW.vehiculo_id,
    v_fecha_inicio,
    v_fecha_fin,
    NEW.orden_servicio_id
  );

  IF NOT v_disponible THEN
    RAISE EXCEPTION 'Conflicto de disponibilidad: %', v_motivo;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validar_asignacion_vehiculo
  BEFORE INSERT ON asignaciones_vehiculos
  FOR EACH ROW EXECUTE FUNCTION fn_validar_asignacion_vehiculo();

CREATE OR REPLACE FUNCTION fn_validar_asignacion_equipo()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_disponible BOOLEAN;
  v_motivo TEXT;
  v_fecha_inicio TIMESTAMPTZ;
  v_fecha_fin TIMESTAMPTZ;
BEGIN
  SELECT fecha_inicio, fecha_fin INTO v_fecha_inicio, v_fecha_fin
  FROM ordenes_servicio
  WHERE id = NEW.orden_servicio_id;

  SELECT disponible, motivo INTO v_disponible, v_motivo
  FROM public.fn_verificar_disponibilidad_equipo(
    NEW.equipo_id,
    v_fecha_inicio,
    v_fecha_fin,
    NEW.orden_servicio_id
  );

  IF NOT v_disponible THEN
    RAISE EXCEPTION 'Conflicto de disponibilidad: %', v_motivo;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validar_asignacion_equipo
  BEFORE INSERT ON asignaciones_equipos
  FOR EACH ROW EXECUTE FUNCTION fn_validar_asignacion_equipo();

-- Trigger para generar folio automáticamente en órdenes de servicio
CREATE OR REPLACE FUNCTION fn_generar_folio_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.folio IS NULL THEN
    NEW.folio := public.fn_generar_folio();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_generar_folio
  BEFORE INSERT ON ordenes_servicio
  FOR EACH ROW EXECUTE FUNCTION fn_generar_folio_trigger();
