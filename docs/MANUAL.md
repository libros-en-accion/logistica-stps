# Manual del Sistema STPS Logística

## Roles de usuario

| Rol | Permisos |
|-----|----------|
| **Administrador** | CRUD completo en todos los módulos, configuración, reportes |
| **Coordinador Logístico** | Crear/editar órdenes, gestionar catálogos, consultar calendario |
| **Supervisor** | Lectura de calendario, reportes, aprobaciones |
| **Técnico** | Solo lectura de sus asignaciones |

## Módulos

### Dashboard (`/dashboard`)
- KPIs: servicios hoy, esta semana, disponibilidad de recursos
- Gráficos: servicios por mes, distribución por técnico
- Alertas: calibraciones próximas a vencer, mantenimientos pendientes
- Actividad reciente

### Catálogos (`/catalogos/*`)
CRUD para: Técnicos, Vehículos, Equipos de Medición, Normas STPS, Clientes.
Cada catálogo ofrece búsqueda, ordenamiento y paginación.

### Órdenes de Servicio (`/ordenes-servicio`)
1. **Listado** - Tabla con filtros por estado, cliente, fecha
2. **Nueva** - Formulario en 3 pasos:
   - Paso 1: Cliente, dirección, fechas, normas
   - Paso 2: Asignación de técnicos, vehículos, equipos
   - Paso 3: Validación de conflictos + confirmación

   Estados: `borrador → programada → en_curso → completada`
   También: `→ cancelada` (desde borrador/programada)

### Calendario (`/calendario`)
Vistas: mes, semana, día, lista. Click en día → nueva OS. Drag & drop para re-programar.
Colores: azul (programada), verde (en curso), naranja (vacaciones), amarillo (mantenimiento), morado (calibración).

### Bloqueos (`/bloqueos`)
Gestión de estados temporales: vacaciones, incapacidad, mantenimiento, calibración.
Los recursos bloqueados no pueden asignarse a órdenes nuevas.

### Reportes (`/reportes`)
Landing con acceso a reportes de técnicos, vehículos y equipos.

## Validación de Conflictos

El motor verifica automáticamente al crear una orden:
- Técnico libre en el rango de fechas (sin OS solapadas ni bloqueos)
- Vehículo disponible (sin asignación ni mantenimiento)
- Equipo con calibración vigente y disponible
- Técnico certificado para la(s) norma(s) requeridas

## Atajos

- Click en evento del calendario → detalle de orden
- Click en día vacío del calendario → crear nueva OS con fecha pre-llenada
- Drag & drop en calendario → re-programar orden
