-- Fase 1, Tarea 1.3: Índices críticos para rendimiento

-- Índices para búsqueda de conflictos (rendimiento del motor de validación)
CREATE INDEX idx_asig_tec_orden ON asignaciones_tecnicos(orden_servicio_id);
CREATE INDEX idx_asig_tec_tecnico ON asignaciones_tecnicos(tecnico_id);
CREATE INDEX idx_asig_veh_orden ON asignaciones_vehiculos(orden_servicio_id);
CREATE INDEX idx_asig_veh_vehiculo ON asignaciones_vehiculos(vehiculo_id);
CREATE INDEX idx_asig_equip_orden ON asignaciones_equipos(orden_servicio_id);
CREATE INDEX idx_asig_equip_equipo ON asignaciones_equipos(equipo_id);

-- Índices para bloqueos (búsqueda por recurso y rango de fechas)
CREATE INDEX idx_bloqueos_recurso ON bloqueos_recursos(tipo_recurso, recurso_id);
CREATE INDEX idx_bloqueos_fechas ON bloqueos_recursos(fecha_inicio, fecha_fin);

-- Índices para órdenes de servicio
CREATE INDEX idx_os_estado ON ordenes_servicio(estado);
CREATE INDEX idx_os_fechas ON ordenes_servicio(fecha_inicio, fecha_fin);
CREATE INDEX idx_os_cliente ON ordenes_servicio(cliente_id);

-- Índice para historial
CREATE INDEX idx_historial_tabla ON historial_cambios(tabla_afectada, registro_id);

-- Índices adicionales para catálogos
CREATE INDEX idx_tecnicos_estado ON tecnicos(estado);
CREATE INDEX idx_vehiculos_estado ON vehiculos(estado);
CREATE INDEX idx_equipos_estado ON equipos_medicion(estado);
CREATE INDEX idx_equipos_vigencia ON equipos_medicion(vigencia_calibracion);
