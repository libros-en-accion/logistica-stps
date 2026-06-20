-- Fase 1, Tarea 1.5: Row Level Security (RLS) policies

-- Habilitar RLS en todas las tablas
ALTER TABLE perfiles_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE normas_stps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos_medicion ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnico_normas ENABLE ROW LEVEL SECURITY;
ALTER TABLE norma_equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_normas ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones_tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones_vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones_equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueos_recursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_cambios ENABLE ROW LEVEL SECURITY;

-- Función helper para obtener rol del usuario actual
CREATE OR REPLACE FUNCTION fn_get_user_role()
RETURNS rol_usuario
LANGUAGE sql
STABLE
AS $$
  SELECT rol FROM perfiles_usuario WHERE id = auth.uid()
$$;

-- Políticas para perfiles_usuario
CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON perfiles_usuario FOR SELECT
  USING (id = auth.uid() OR fn_get_user_role() IN ('admin', 'coordinador'));

CREATE POLICY "Solo admin puede crear perfiles"
  ON perfiles_usuario FOR INSERT
  WITH CHECK (fn_get_user_role() = 'admin');

CREATE POLICY "Admin y coordinador pueden actualizar perfiles"
  ON perfiles_usuario FOR UPDATE
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

-- Políticas para catálogos (lectura general, escritura restringida)
CREATE POLICY "Todos pueden leer clientes"
  ON clientes FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden modificar clientes"
  ON clientes FOR ALL
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

CREATE POLICY "Todos pueden leer normas STPS"
  ON normas_stps FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden modificar normas"
  ON normas_stps FOR ALL
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

CREATE POLICY "Todos pueden leer técnicos"
  ON tecnicos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden modificar técnicos"
  ON tecnicos FOR ALL
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

CREATE POLICY "Todos pueden leer vehículos"
  ON vehiculos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden modificar vehículos"
  ON vehiculos FOR ALL
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

CREATE POLICY "Todos pueden leer equipos"
  ON equipos_medicion FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden modificar equipos"
  ON equipos_medicion FOR ALL
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

-- Políticas para relaciones M:M de catálogos
CREATE POLICY "Todos pueden leer tecnico_normas"
  ON tecnico_normas FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden modificar tecnico_normas"
  ON tecnico_normas FOR ALL
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

CREATE POLICY "Todos pueden leer norma_equipos"
  ON norma_equipos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden modificar norma_equipos"
  ON norma_equipos FOR ALL
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

-- Políticas para órdenes de servicio
CREATE POLICY "Todos pueden leer órdenes de servicio"
  ON ordenes_servicio FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden crear órdenes"
  ON ordenes_servicio FOR INSERT
  WITH CHECK (fn_get_user_role() IN ('admin', 'coordinador'));

CREATE POLICY "Admin y coordinador pueden actualizar órdenes"
  ON ordenes_servicio FOR UPDATE
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

-- Políticas para asignaciones
CREATE POLICY "Todos pueden leer asignaciones"
  ON asignaciones_tecnicos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden modificar asignaciones_tecnicos"
  ON asignaciones_tecnicos FOR ALL
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

CREATE POLICY "Todos pueden leer asignaciones de vehículos"
  ON asignaciones_vehiculos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden modificar asignaciones_vehiculos"
  ON asignaciones_vehiculos FOR ALL
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

CREATE POLICY "Todos pueden leer asignaciones de equipos"
  ON asignaciones_equipos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden modificar asignaciones_equipos"
  ON asignaciones_equipos FOR ALL
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

-- Políticas para bloqueos
CREATE POLICY "Todos pueden leer bloqueos"
  ON bloqueos_recursos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden crear bloqueos"
  ON bloqueos_recursos FOR INSERT
  WITH CHECK (fn_get_user_role() IN ('admin', 'coordinador'));

CREATE POLICY "Admin y coordinador pueden actualizar bloqueos"
  ON bloqueos_recursos FOR UPDATE
  USING (fn_get_user_role() IN ('admin', 'coordinador'));

-- Políticas para historial (solo lectura)
CREATE POLICY "Todos pueden leer historial"
  ON historial_cambios FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Políticas para relaciones de órdenes
CREATE POLICY "Todos pueden leer ordenes_normas"
  ON ordenes_normas FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin y coordinador pueden modificar ordenes_normas"
  ON ordenes_normas FOR ALL
  USING (fn_get_user_role() IN ('admin', 'coordinador'));
