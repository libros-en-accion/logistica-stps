-- Fase 1, Tarea 1.4: ENUMs para estados

-- Estados de Orden de Servicio
CREATE TYPE estado_os AS ENUM (
  'borrador',
  'programada',
  'en_curso',
  'completada',
  'cancelada'
);

-- Estados de recurso (técnico, vehículo, equipo)
CREATE TYPE estado_recurso AS ENUM (
  'disponible',
  'asignado',
  'en_mantenimiento',
  'en_calibracion',
  'baja',
  'vacaciones',
  'incapacidad'
);

-- Tipos de bloqueo temporal
CREATE TYPE tipo_bloqueo AS ENUM (
  'vacaciones',
  'incapacidad',
  'mantenimiento',
  'calibracion',
  'prestamo',
  'otro'
);

-- Tipos de recurso (para bloqueos polimórficos)
CREATE TYPE tipo_recurso AS ENUM (
  'tecnico',
  'vehiculo',
  'equipo'
);

-- Roles de usuario
CREATE TYPE rol_usuario AS ENUM (
  'admin',
  'coordinador',
  'supervisor',
  'tecnico'
);

-- Acciones de auditoría
CREATE TYPE accion_auditoria AS ENUM (
  'INSERT',
  'UPDATE',
  'DELETE'
);
