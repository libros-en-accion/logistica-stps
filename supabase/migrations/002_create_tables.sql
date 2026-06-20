-- Fase 1, Tareas 1.2 y 1.3: Tablas, relaciones, foreign keys y constraints

-- Tabla de perfiles de usuario (vinculada a auth.users)
CREATE TABLE perfiles_usuario (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL,
  rol rol_usuario NOT NULL DEFAULT 'tecnico',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Catálogo de clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razon_social TEXT NOT NULL,
  rfc TEXT UNIQUE NOT NULL,
  contacto_nombre TEXT,
  contacto_tel TEXT,
  contacto_email TEXT,
  direccion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Catálogo de normas STPS
CREATE TABLE normas_stps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Catálogo de técnicos evaluadores
CREATE TABLE tecnicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  rfc TEXT UNIQUE NOT NULL,
  telefono TEXT,
  email TEXT,
  direccion TEXT,
  estado estado_recurso DEFAULT 'disponible',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Catálogo de vehículos
CREATE TABLE vehiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_unidad TEXT UNIQUE NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  anio INTEGER NOT NULL CHECK (anio >= 1990 AND anio <= EXTRACT(YEAR FROM now()) + 1),
  placas TEXT UNIQUE NOT NULL,
  color TEXT,
  vin TEXT UNIQUE,
  km_actual INTEGER DEFAULT 0,
  estado estado_recurso DEFAULT 'disponible',
  prox_mantto DATE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Catálogo de equipos de medición
CREATE TABLE equipos_medicion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_interno TEXT UNIQUE NOT NULL,
  descripcion TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  numero_serie TEXT UNIQUE,
  fecha_calibracion DATE,
  vigencia_calibracion DATE,
  lab_calibracion TEXT,
  certificado_url TEXT,
  estado estado_recurso DEFAULT 'disponible',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Relación M:M técnico ↔ normas (certificaciones)
CREATE TABLE tecnico_normas (
  tecnico_id UUID NOT NULL REFERENCES tecnicos(id) ON DELETE CASCADE,
  norma_id UUID NOT NULL REFERENCES normas_stps(id) ON DELETE CASCADE,
  PRIMARY KEY (tecnico_id, norma_id)
);

-- Relación M:M norma ↔ equipos requeridos
CREATE TABLE norma_equipos (
  norma_id UUID NOT NULL REFERENCES normas_stps(id) ON DELETE CASCADE,
  equipo_tipo TEXT NOT NULL,
  cantidad_requerida INTEGER DEFAULT 1,
  PRIMARY KEY (norma_id, equipo_tipo)
);

-- Tabla central: Órdenes de servicio
CREATE TABLE ordenes_servicio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio TEXT UNIQUE NOT NULL,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  direccion_servicio TEXT NOT NULL,
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ NOT NULL,
  estado estado_os DEFAULT 'borrador',
  observaciones TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_fechas CHECK (fecha_fin > fecha_inicio)
);

-- Relación M:M orden de servicio ↔ normas evaluadas
CREATE TABLE ordenes_normas (
  orden_servicio_id UUID NOT NULL REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
  norma_id UUID NOT NULL REFERENCES normas_stps(id) ON DELETE RESTRICT,
  PRIMARY KEY (orden_servicio_id, norma_id)
);

-- Relación 1:M orden de servicio ↔ técnicos asignados
CREATE TABLE asignaciones_tecnicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_servicio_id UUID NOT NULL REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
  tecnico_id UUID NOT NULL REFERENCES tecnicos(id) ON DELETE RESTRICT,
  UNIQUE (orden_servicio_id, tecnico_id)
);

-- Relación 1:M orden de servicio ↔ vehículos asignados
CREATE TABLE asignaciones_vehiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_servicio_id UUID NOT NULL REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
  vehiculo_id UUID NOT NULL REFERENCES vehiculos(id) ON DELETE RESTRICT,
  UNIQUE (orden_servicio_id, vehiculo_id)
);

-- Relación 1:M orden de servicio ↔ equipos asignados
CREATE TABLE asignaciones_equipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden_servicio_id UUID NOT NULL REFERENCES ordenes_servicio(id) ON DELETE CASCADE,
  equipo_id UUID NOT NULL REFERENCES equipos_medicion(id) ON DELETE RESTRICT,
  UNIQUE (orden_servicio_id, equipo_id)
);

-- Tabla de bloqueos temporales de recursos (polimórfica)
CREATE TABLE bloqueos_recursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_recurso tipo_recurso NOT NULL,
  recurso_id UUID NOT NULL,
  tipo_bloqueo tipo_bloqueo NOT NULL,
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ NOT NULL,
  observaciones TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_bloqueo_fechas CHECK (fecha_fin > fecha_inicio)
);

-- Historial de cambios (auditoría)
CREATE TABLE historial_cambios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tabla_afectada TEXT NOT NULL,
  registro_id UUID NOT NULL,
  accion accion_auditoria NOT NULL,
  datos_anteriores JSONB,
  datos_nuevos JSONB,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
