-- Fase 1, Tarea 1.9: Datos semilla para pruebas

-- Normas STPS (catálogo base)
INSERT INTO normas_stps (clave, nombre, descripcion, activa) VALUES
('NOM-001-STPS', 'Edificios, locales, instalaciones y áreas en los centros de trabajo', 'Condiciones de seguridad e higiene en los centros de trabajo para el desarrollo de los trabajadores', true),
('NOM-002-STPS', 'Condiciones de seguridad - Prevención y protección contra incendios', 'Prevención y protección contra incendios en los centros de trabajo', true),
('NOM-011-STPS', 'Actividades que requieran el uso de equipos de protección personal', 'Selección, uso y manejo de los equipos de protección personal', true),
('NOM-012-STPS', 'Seguridad y salud en el trabajo - Edificación y movimiento de tierras', 'Condiciones de seguridad y salud en el trabajo en obras de construcción', true),
('NOM-015-STPS', 'Condiciones térmicas elevadas o abatidas', 'Condiciones térmicas elevadas o abatidas en los centros de trabajo', true),
('NOM-017-STPS', 'Equipos de protección personal - Selección, uso y manejo', 'Equipos de protección personal en los centros de trabajo', true),
('NOM-025-STPS', 'Iluminación en los centros de trabajo', 'Condiciones de iluminación en los centros de trabajo', true),
('NOM-036-STPS', 'Manejo manual de cargas', 'Factores de riesgo ergonómico en el trabajo - Identificación, análisis y prevención', true);

-- Técnicos evaluadores
INSERT INTO tecnicos (nombre, apellidos, rfc, telefono, email, estado, activo) VALUES
('Juan', 'Pérez García', 'PEGJ800101XXX', '555-1234-567', 'juan.perez@empresa.com', 'disponible', true),
('María', 'González López', 'GOLM850515YYY', '555-2345-678', 'maria.gonzalez@empresa.com', 'disponible', true),
('Carlos', 'Rodríguez Sánchez', 'ROSC900820ZZZ', '555-3456-789', 'carlos.rodriguez@empresa.com', 'disponible', true),
('Ana', 'Martínez Ruiz', 'MARU880310AAA', '555-4567-890', 'ana.martinez@empresa.com', 'disponible', true),
('Luis', 'Hernández Torres', 'HETL920725BBB', '555-5678-901', 'luis.hernandez@empresa.com', 'disponible', true);

-- Certificaciones de técnicos (relación con normas)
INSERT INTO tecnico_normas (tecnico_id, norma_id)
SELECT t.id, n.id
FROM tecnicos t
CROSS JOIN normas_stps n
WHERE (t.nombre = 'Juan' AND n.clave IN ('NOM-001-STPS', 'NOM-002-STPS', 'NOM-011-STPS'))
   OR (t.nombre = 'María' AND n.clave IN ('NOM-001-STPS', 'NOM-017-STPS', 'NOM-025-STPS'))
   OR (t.nombre = 'Carlos' AND n.clave IN ('NOM-002-STPS', 'NOM-012-STPS', 'NOM-036-STPS'))
   OR (t.nombre = 'Ana' AND n.clave IN ('NOM-015-STPS', 'NOM-025-STPS', 'NOM-036-STPS'))
   OR (t.nombre = 'Luis' AND n.clave IN ('NOM-001-STPS', 'NOM-002-STPS', 'NOM-011-STPS', 'NOM-017-STPS'));

-- Vehículos
INSERT INTO vehiculos (numero_unidad, marca, modelo, anio, placas, color, vin, km_actual, estado, prox_mantto, activo) VALUES
('VH-001', 'Toyota', 'Hilux', 2022, 'ABC-123', 'Blanco', '1HGCM82633A123456', 25000, 'disponible', '2026-07-15', true),
('VH-002', 'Ford', 'Ranger', 2023, 'DEF-456', 'Gris', '2HGCM82633A234567', 15000, 'disponible', '2026-08-01', true),
('VH-003', 'Nissan', 'NP300', 2021, 'GHI-789', 'Rojo', '3HGCM82633A345678', 45000, 'disponible', '2026-06-30', true),
('VH-004', 'Chevrolet', 'Colorado', 2022, 'JKL-012', 'Negro', '4HGCM82633A456789', 32000, 'disponible', '2026-07-20', true),
('VH-005', 'Toyota', 'Tacoma', 2023, 'MNO-345', 'Azul', '5HGCM82633A567890', 18000, 'disponible', '2026-09-10', true);

-- Equipos de medición
INSERT INTO equipos_medicion (id_interno, descripcion, marca, modelo, numero_serie, fecha_calibracion, vigencia_calibracion, lab_calibracion, estado, activo) VALUES
('EQ-LX-001', 'Luxómetro digital', 'Extech', 'LT300', 'LX2023001', '2026-01-15', '2026-07-15', 'LabCalib SA de CV', 'disponible', true),
('EQ-LX-002', 'Luxómetro portátil', 'Extech', 'LT300', 'LX2023002', '2026-02-20', '2026-08-20', 'LabCalib SA de CV', 'disponible', true),
('EQ-SN-001', 'Sonómetro integrador', 'Casella', 'CEL-620', 'SN2023001', '2026-03-10', '2026-09-10', 'Metrología MX', 'disponible', true),
('EQ-SN-002', 'Sonómetro clase 1', 'Casella', 'CEL-620', 'SN2023002', '2026-04-05', '2026-10-05', 'Metrología MX', 'disponible', true),
('EQ-TR-001', 'Termohigrómetro', 'Fluke', '971', 'TH2023001', '2026-01-30', '2026-07-30', 'Calibraciones Industriales', 'disponible', true),
('EQ-TR-002', 'Termómetro infrarrojo', 'Fluke', '62 MAX+', 'TR2023001', '2026-02-15', '2026-08-15', 'Calibraciones Industriales', 'disponible', true),
('EQ-VM-001', 'Vibrómetro', 'Extech', '407860', 'VM2023001', '2026-03-25', '2026-09-25', 'LabCalib SA de CV', 'disponible', true),
('EQ-VM-002', 'Analizador de vibraciones', 'Fluke', '810', 'VM2023002', '2026-04-10', '2026-10-10', 'Metrología MX', 'disponible', true);

-- Equipos requeridos por norma
INSERT INTO norma_equipos (norma_id, equipo_tipo, cantidad_requerida)
SELECT n.id, 'Luxómetro', 1
FROM normas_stps n WHERE n.clave = 'NOM-025-STPS';

INSERT INTO norma_equipos (norma_id, equipo_tipo, cantidad_requerida)
SELECT n.id, 'Sonómetro', 1
FROM normas_stps n WHERE n.clave = 'NOM-011-STPS';

INSERT INTO norma_equipos (norma_id, equipo_tipo, cantidad_requerida)
SELECT n.id, 'Termohigrómetro', 1
FROM normas_stps n WHERE n.clave = 'NOM-015-STPS';

INSERT INTO norma_equipos (norma_id, equipo_tipo, cantidad_requerida)
SELECT n.id, 'Vibrómetro', 1
FROM normas_stps n WHERE n.clave = 'NOM-036-STPS';

-- Clientes
INSERT INTO clientes (razon_social, rfc, contacto_nombre, contacto_tel, contacto_email, direccion, activo) VALUES
('Constructora del Norte SA de CV', 'CDN900101ABC', 'Ing. Roberto Martínez', '555-1111-2222', 'roberto.martinez@constructoranorte.com', 'Av. Revolución 123, Col. Centro, CDMX', true),
('Industrias Metalúrgicas del Pacífico', 'IMP850202DEF', 'Lic. Patricia Vega', '555-2222-3333', 'patricia.vega@impacifico.com', 'Blvd. Industrial 456, Parque Industrial, Tijuana', true),
('Alimentos Procesados de México', 'APM950303GHI', 'Sr. Jorge Ramírez', '555-3333-4444', 'jorge.ramirez@apmexico.com', 'Carretera a Querétaro Km 25, Parque Industrial, Querétaro', true),
('Textiles del Bajío', 'TDB000404JKL', 'Ing. Laura Sánchez', '555-4444-5555', 'laura.sanchez@textilesbajio.com', 'Av. Textil 789, Zona Industrial, León', true),
('Plásticos Modernos SA', 'PMS880505MNO', 'C.P. Fernando Ortiz', '555-5555-6666', 'fernando.ortiz@plasticosmodernos.com', 'Calle Plástico 321, Parque Industrial, Puebla', true);

-- Órdenes de servicio de ejemplo
INSERT INTO ordenes_servicio (folio, cliente_id, direccion_servicio, fecha_inicio, fecha_fin, estado, observaciones)
SELECT
  'OS-202606-' || LPAD(gs::TEXT, 4, '0'),
  (SELECT id FROM clientes WHERE razon_social = 'Constructora del Norte SA de CV'),
  'Obra: Edificio Corporativo Torre Norte, Av. Insurgentes 500',
  '2026-06-25 08:00:00'::TIMESTAMPTZ,
  '2026-06-25 17:00:00'::TIMESTAMPTZ,
  'programada',
  'Evaluación de condiciones de iluminación en áreas de oficinas'
FROM generate_series(1, 1) gs;

-- Asignaciones para la orden de servicio de ejemplo
INSERT INTO asignaciones_tecnicos (orden_servicio_id, tecnico_id)
SELECT os.id, t.id
FROM ordenes_servicio os
CROSS JOIN tecnicos t
WHERE os.folio = 'OS-202606-0001'
  AND t.nombre = 'María'
  AND t.apellidos = 'González López';

INSERT INTO asignaciones_vehiculos (orden_servicio_id, vehiculo_id)
SELECT os.id, v.id
FROM ordenes_servicio os
CROSS JOIN vehiculos v
WHERE os.folio = 'OS-202606-0001'
  AND v.numero_unidad = 'VH-001';

INSERT INTO asignaciones_equipos (orden_servicio_id, equipo_id)
SELECT os.id, e.id
FROM ordenes_servicio os
CROSS JOIN equipos_medicion e
WHERE os.folio = 'OS-202606-0001'
  AND e.id_interno = 'EQ-LX-001';

-- Relación orden-norma
INSERT INTO ordenes_normas (orden_servicio_id, norma_id)
SELECT os.id, n.id
FROM ordenes_servicio os
CROSS JOIN normas_stps n
WHERE os.folio = 'OS-202606-0001'
  AND n.clave = 'NOM-025-STPS';

-- Bloqueos de ejemplo
INSERT INTO bloqueos_recursos (tipo_recurso, recurso_id, tipo_bloqueo, fecha_inicio, fecha_fin, observaciones)
SELECT 'tecnico', t.id, 'vacaciones',
  '2026-07-01 00:00:00'::TIMESTAMPTZ,
  '2026-07-15 23:59:59'::TIMESTAMPTZ,
  'Periodo vacacional de verano'
FROM tecnicos t WHERE t.nombre = 'Juan' AND t.apellidos = 'Pérez García';

INSERT INTO bloqueos_recursos (tipo_recurso, recurso_id, tipo_bloqueo, fecha_inicio, fecha_fin, observaciones)
SELECT 'vehiculo', v.id, 'mantenimiento',
  '2026-06-30 08:00:00'::TIMESTAMPTZ,
  '2026-06-30 18:00:00'::TIMESTAMPTZ,
  'Servicio de 45,000 km'
FROM vehiculos v WHERE v.numero_unidad = 'VH-003';

INSERT INTO bloqueos_recursos (tipo_recurso, recurso_id, tipo_bloqueo, fecha_inicio, fecha_fin, observaciones)
SELECT 'equipo', e.id, 'calibracion',
  '2026-07-10 00:00:00'::TIMESTAMPTZ,
  '2026-07-12 23:59:59'::TIMESTAMPTZ,
  'Recalibración anual en laboratorio'
FROM equipos_medicion e WHERE e.id_interno = 'EQ-SN-002';
