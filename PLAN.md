# 🗺️ PLAN DE ACCIÓN — Sistema Integrado de Control Logístico para Evaluaciones STPS

> **Versión:** 1.0  
> **Fecha de Creación:** 12 de Junio de 2026  
> **Estado:** Borrador para Aprobación  
> **Duración Estimada Total:** 8–10 semanas  

---

## 📋 Índice

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Arquitectura Tecnológica Definitiva](#2-arquitectura-tecnológica-definitiva)
3. [Estrategia de Modelos de IA por Fase](#3-estrategia-de-modelos-de-ia-por-fase)
4. [Fase 0 — Preparación del Entorno](#4-fase-0--preparación-del-entorno)
5. [Fase 1 — Base de Datos y Backend (Supabase)](#5-fase-1--base-de-datos-y-backend-supabase)
6. [Fase 2 — Autenticación y Control de Acceso](#6-fase-2--autenticación-y-control-de-acceso)
7. [Fase 3 — Módulo de Catálogos (CRUD)](#7-fase-3--módulo-de-catálogos-crud)
8. [Fase 4 — Motor de Validación de Conflictos](#8-fase-4--motor-de-validación-de-conflictos)
9. [Fase 5 — Módulo de Órdenes de Servicio](#9-fase-5--módulo-de-órdenes-de-servicio)
10. [Fase 6 — Interfaz de Calendario Interactivo](#10-fase-6--interfaz-de-calendario-interactivo)
11. [Fase 7 — Gestión de Estados Temporales](#11-fase-7--gestión-de-estados-temporales)
12. [Fase 8 — Dashboard y Reportes](#12-fase-8--dashboard-y-reportes)
13. [Fase 9 — Pruebas, QA y Optimización](#13-fase-9--pruebas-qa-y-optimización)
14. [Fase 10 — Despliegue y Puesta en Producción](#14-fase-10--despliegue-y-puesta-en-producción)
15. [Esquema de Base de Datos Detallado](#15-esquema-de-base-de-datos-detallado)
16. [Estructura de Archivos del Proyecto](#16-estructura-de-archivos-del-proyecto)
17. [Cronograma Visual (Gantt)](#17-cronograma-visual-gantt)
18. [Riesgos y Mitigaciones](#18-riesgos-y-mitigaciones)
19. [Criterios de Aceptación por Módulo](#19-criterios-de-aceptación-por-módulo)
20. [Glosario](#20-glosario)

---

## 1. Visión General del Proyecto

### 1.1 Objetivo
Desarrollar una aplicación web que permita gestionar la logística operativa de evaluaciones STPS en campo, controlando la asignación de **técnicos**, **vehículos** y **equipos de medición** con validación automática de conflictos de disponibilidad.

### 1.2 Usuarios del Sistema
| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Administrador** | Control total del sistema | CRUD completo, configuración, reportes |
| **Coordinador Logístico** | Gestión diaria de asignaciones | Crear/editar órdenes, consultar calendario |
| **Supervisor** | Supervisión y consulta | Lectura de calendario, reportes, aprobaciones |
| **Técnico** (futuro) | Consulta de asignaciones propias | Solo lectura de sus servicios |

### 1.3 Módulos del Sistema
```
┌─────────────────────────────────────────────────────────┐
│                    SISTEMA STPS LOGÍSTICA                │
├─────────────┬──────────────┬──────────────┬─────────────┤
│  Catálogos  │   Órdenes    │  Calendario  │  Dashboard  │
│             │  de Servicio │  Interactivo │  & Reportes │
├─────────────┼──────────────┼──────────────┼─────────────┤
│ • Técnicos  │ • Crear OS   │ • Vista mes  │ • KPIs      │
│ • Vehículos │ • Asignar    │ • Vista sem  │ • Ocupación │
│ • Equipos   │   recursos   │ • Vista día  │ • Alertas   │
│ • Normas    │ • Validar    │ • Filtros    │ • Historial │
│ • Clientes  │   conflictos │ • Drag&Drop  │ • Exportar  │
├─────────────┴──────────────┴──────────────┴─────────────┤
│              Motor de Validación de Conflictos           │
├─────────────────────────────────────────────────────────┤
│         Gestión de Estados Temporales (Bloqueos)         │
├─────────────────────────────────────────────────────────┤
│     Autenticación & Control de Acceso (Supabase Auth)    │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Arquitectura Tecnológica Definitiva

### 2.1 Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | **Next.js 15 (App Router)** | SSR/SSG para rendimiento, rutas basadas en archivos, React Server Components para optimización |
| **UI Components** | **shadcn/ui + Tailwind CSS 4** | Componentes accesibles, personalizables y profesionales sin dependencia de librería pesada |
| **Calendario** | **FullCalendar (React)** | Librería madura, soporte drag & drop, múltiples vistas, integración con React |
| **Estado Global** | **Zustand** | Ligero, sin boilerplate, ideal para estado de UI y cache local |
| **Formularios** | **React Hook Form + Zod** | Validación type-safe en cliente y servidor, rendimiento óptimo |
| **Backend/BaaS** | **Supabase** | Auth, PostgreSQL, Row Level Security, Realtime, Storage — todo integrado |
| **ORM/Query** | **Supabase JS Client v2** | Tipado automático desde el schema de PostgreSQL |
| **Despliegue** | **Vercel** (frontend) + **Supabase Cloud** (backend) | Free tier generoso, CI/CD automático, CDN global |
| **Control de Versiones** | **Git + GitHub** | Estándar de la industria, integración con Vercel |

### 2.2 Diagrama de Arquitectura

```
┌──────────────────────────────────────────────────────────────┐
│                        USUARIO (Browser)                      │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                     VERCEL (CDN + Edge)                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │  │
│  │  │ Catálogos│ │ Órdenes  │ │Calendario│ │Dashboard │  │  │
│  │  │  CRUD    │ │ Servicio │ │Interactv.│ │& Reports │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐│  │
│  │  │  API Routes (Next.js) — Lógica de negocio pesada   ││  │
│  │  └────────────────────────────────────────────────────┘│  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────┘
                       │ Supabase Client / REST API
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                     SUPABASE CLOUD                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │   Auth   │ │PostgreSQL│ │ Realtime │ │Edge Functions │   │
│  │  (JWT)   │ │  + RLS   │ │(WebSocket│ │(Validaciones)│   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Estrategia de Modelos de IA por Fase

> **Principio rector:** Cada modelo tiene fortalezas específicas. Seleccionar el modelo correcto para cada tarea maximiza la calidad del código generado, minimiza iteraciones de corrección y optimiza el costo de tokens.

### 3.1 Tabla Maestra de Asignación de Modelos

| Fase | Tarea Principal | Modelo Recomendado | Alternativa | Justificación |
|------|----------------|--------------------|----|---------------|
| **0 — Preparación** | Scaffolding, configuración inicial | **DeepSeek V4 Pro** | MiniMax M2.7 | Ejecución rápida de boilerplate y configuración de proyecto; equilibrio perfecto entre velocidad e inteligencia |
| **1 — Base de Datos** | Diseño de schema SQL, migraciones, RLS | **Qwen 3.7 Max** | GLM-5.1 | Tarea crítica de arquitectura que requiere razonamiento complejo sobre relaciones, constraints y políticas de seguridad |
| **2 — Autenticación** | Auth flows, middleware, protección de rutas | **DeepSeek V4 Pro** | MiniMax M2.5 | Implementación de patrones bien documentados de Supabase Auth; velocidad y precisión en código repetitivo |
| **3 — Catálogos CRUD** | Componentes de formularios, tablas, filtros | **DeepSeek V4 Pro** | MiniMax M2.7 | Alto volumen de código frontend estructurado; el modelo más eficiente para generación masiva de componentes |
| **4 — Motor de Validación** | Algoritmos de detección de conflictos | **GLM-5.1** | Qwen 3.7 Max | Lógica matemática y temporal compleja; GLM destaca en razonamiento lógico puro y consistencia |
| **4 — Revisión del Motor** | Code review del motor de validación | **Kimi K2.6** | Qwen 3.7 Max | Kimi cuestiona y razona críticamente antes de ejecutar; ideal para encontrar edge cases y fallas lógicas |
| **5 — Órdenes de Servicio** | Flujo completo de OS con validaciones | **DeepSeek V4 Pro** | MiniMax M2.7 | Integración full-stack que combina UI + lógica + BD; DeepSeek V4 Pro es el más equilibrado |
| **6 — Calendario** | Integración FullCalendar, drag & drop | **DeepSeek V4 Pro** | MiniMax M2.5 | Implementación de librería de terceros con personalización; requiere buen conocimiento de APIs de React |
| **7 — Estados Temporales** | Sistema de bloqueos y estados | **MiMo-V2.5-Pro** | DeepSeek V4 Pro | Módulo enfocado tipo "parche" sobre sistema existente; MiMo excela en construcción incremental |
| **8 — Dashboard** | Visualizaciones, KPIs, gráficos | **DeepSeek V4 Pro** | MiniMax M2.7 | Componentes visuales complejos con datos agregados; buen balance de UI y queries |
| **9 — Testing/QA** | Tests unitarios, integración, E2E | **Kimi K2.6** | GLM-5.1 | Revisión crítica exhaustiva; Kimi identifica casos borde y escenarios de falla |
| **10 — Deploy** | CI/CD, variables de entorno, dominio | **DeepSeek V4 Flash** | DeepSeek V4 Flash Max | Tareas de configuración rápida y lectura de documentación; Flash es ultrarrápido para estas operaciones |

### 3.2 Cuándo Usar Cada Modelo — Guía Rápida

```
📐 PLANIFICACIÓN Y ARQUITECTURA
   → Qwen 3.7 Max (razonamiento profundo, visión global)
   → Kimi K2.6 (cuestionamiento crítico del plan)

⚙️ IMPLEMENTACIÓN DE CÓDIGO (volumen alto)
   → DeepSeek V4 Pro (caballo de batalla principal)
   → MiniMax M2.7 (alternativa sólida full-stack)

🧮 LÓGICA COMPLEJA Y ALGORITMOS
   → GLM-5.1 (razonamiento lógico/matemático superior)
   → Qwen 3.7 Max (cuando involucra contexto amplio)

🔍 REVISIÓN, QA Y CODE REVIEW
   → Kimi K2.6 (crítico, busca fallas activamente)
   → GLM-5.1 (consistente y metódico)

🩹 PARCHES, AJUSTES Y MÓDULOS INCREMENTALES
   → MiMo-V2.5-Pro (enfocado, preciso en cambios parciales)

⚡ EXPLORACIÓN, LECTURA Y TAREAS RÁPIDAS
   → DeepSeek V4 Flash / Flash Max (ultrarrápido)

🏗️ SCAFFOLDING Y BOILERPLATE
   → DeepSeek V4 Pro (rápido con buen contexto)
   → MiniMax M2.5 (alternativa confiable)
```

### 3.3 Flujo de Trabajo Multi-Modelo por Sesión

Para tareas críticas, se recomienda un flujo de **doble validación**:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   PASO 1:       │     │    PASO 2:        │     │   PASO 3:       │
│   Implementar   │────▶│    Revisar        │────▶│   Corregir      │
│                 │     │                   │     │                 │
│ DeepSeek V4 Pro │     │ Kimi K2.6 ó       │     │ DeepSeek V4 Pro │
│ (genera código) │     │ GLM-5.1 (revisa)  │     │ (aplica fixes)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 4. Fase 0 — Preparación del Entorno
> **Duración estimada:** 2–3 días  
> **Modelo principal:** DeepSeek V4 Pro  
> **Modelo alternativo:** MiniMax M2.7

### 4.1 Tareas

- [x] **0.1** Inicializar repositorio Git en `/home/daniel/006_LOGISTICA`
- [x] **0.2** Crear proyecto Next.js 15 con App Router y TypeScript
  ```bash
  npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
  ```
- [x] **0.3** Instalar dependencias core:
  ```bash
  npm install @supabase/supabase-js @supabase/ssr zustand zod react-hook-form @hookform/resolvers
  npm install @fullcalendar/core @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/list
  npm install date-fns lucide-react recharts sonner
  npm install -D @types/node supabase
  ```
- [x] **0.4** Inicializar shadcn/ui:
  ```bash
  npx -y shadcn@latest init
  npx -y shadcn@latest add button card dialog form input label select table tabs badge calendar dropdown-menu sheet toast popover command separator avatar
  ```
- [x] **0.5** Configurar Supabase:
  - Crear proyecto en Supabase Dashboard
  - Obtener `SUPABASE_URL` y `SUPABASE_ANON_KEY`
  - Crear archivo `.env.local`
- [x] **0.6** Configurar estructura base de carpetas (ver [Sección 16](#16-estructura-de-archivos-del-proyecto))
- [x] **0.7** Configurar ESLint, Prettier y convenciones de código
- [x] **0.8** Crear layout raíz con sidebar de navegación y tema oscuro/claro
- [x] **0.9** Configurar Git: `.gitignore`, primer commit

### 4.2 Entregable
Proyecto Next.js funcional corriendo en `localhost:3000` con navegación básica, tema configurado y conexión a Supabase verificada.

### 4.3 ¿Por qué DeepSeek V4 Pro aquí?
El scaffolding requiere ejecutar múltiples comandos de configuración, crear archivos de boilerplate y configurar integraciones. DeepSeek V4 Pro ofrece el mejor equilibrio entre velocidad y calidad para estas tareas repetitivas pero importantes. No se necesita razonamiento profundo, sino ejecución eficiente.

---

## 5. Fase 1 — Base de Datos y Backend (Supabase)
> **Duración estimada:** 4–5 días  
> **Modelo principal:** Qwen 3.7 Max  
> **Modelo de revisión:** Kimi K2.6  
> **Modelo alternativo:** GLM-5.1

### 5.1 Tareas

- [ ] **1.1** Diseñar schema completo de PostgreSQL (ver [Sección 15](#15-esquema-de-base-de-datos-detallado))
- [ ] **1.2** Crear migración SQL para tablas principales:
  - `tecnicos` — Catálogo de técnicos evaluadores
  - `vehiculos` — Flotilla vehicular
  - `equipos_medicion` — Instrumentos de medición
  - `normas_stps` — Catálogo de normas aplicables
  - `clientes` — Empresas cliente
  - `ordenes_servicio` — Órdenes de servicio (tabla central)
  - `asignaciones_tecnicos` — Relación OS ↔ Técnicos
  - `asignaciones_vehiculos` — Relación OS ↔ Vehículos
  - `asignaciones_equipos` — Relación OS ↔ Equipos
  - `bloqueos_recursos` — Estados temporales de no disponibilidad
  - `historial_cambios` — Log de auditoría
- [ ] **1.3** Definir relaciones, foreign keys, índices y constraints
- [ ] **1.4** Crear ENUMs para estados:
  - Estado de OS: `borrador`, `programada`, `en_curso`, `completada`, `cancelada`
  - Estado de recurso: `disponible`, `asignado`, `en_mantenimiento`, `en_calibracion`, `baja`, `vacaciones`, `incapacidad`
  - Tipo de bloqueo: `vacaciones`, `incapacidad`, `mantenimiento`, `calibracion`, `prestamo`, `otro`
- [ ] **1.5** Implementar Row Level Security (RLS) policies:
  - Política por rol de usuario
  - Restricción de escritura solo a roles autorizados
  - Lectura filtrada por permisos
- [ ] **1.6** Crear funciones PostgreSQL para validación de conflictos (server-side):
  - `fn_verificar_disponibilidad_tecnico(tecnico_id, fecha_inicio, fecha_fin)`
  - `fn_verificar_disponibilidad_vehiculo(vehiculo_id, fecha_inicio, fecha_fin)`
  - `fn_verificar_disponibilidad_equipo(equipo_id, fecha_inicio, fecha_fin)`
  - `fn_verificar_vigencia_calibracion(equipo_id, fecha_servicio)`
- [ ] **1.7** Crear triggers de auditoría para `historial_cambios`
- [ ] **1.8** Crear vistas materializadas para consultas frecuentes:
  - `vista_calendario_recursos` — Vista consolidada para el calendario
  - `vista_disponibilidad_diaria` — Resumen de disponibilidad por día
- [ ] **1.9** Insertar datos semilla (seed data) para pruebas
- [ ] **1.10** Generar tipos TypeScript desde el schema de Supabase:
  ```bash
  npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.types.ts
  ```

### 5.2 Entregable
Base de datos PostgreSQL completamente funcional en Supabase con todas las tablas, relaciones, RLS, funciones de validación y datos de prueba.

### 5.3 ¿Por qué Qwen 3.7 Max aquí?
El diseño del schema de base de datos es la **decisión arquitectónica más crítica** del proyecto. Un error aquí se propaga a todo el sistema. Qwen 3.7 Max ofrece:
- Capacidad de manejar contextos amplios (todo el schema de golpe)
- Razonamiento profundo para relaciones complejas entre tablas
- Excelente para planificación y diseño de alto nivel

**¿Por qué Kimi K2.6 para revisión?** Después de generar el schema, Kimi K2.6 lo revisa críticamente buscando:
- Relaciones faltantes o redundantes
- Posibles problemas de rendimiento en queries
- Edge cases en las constraints
- Fallas en la lógica de RLS

---

## 6. Fase 2 — Autenticación y Control de Acceso
> **Duración estimada:** 2–3 días  
> **Modelo principal:** DeepSeek V4 Pro  
> **Modelo alternativo:** MiniMax M2.5

### 6.1 Tareas

- [ ] **2.1** Configurar Supabase Auth con email/password
- [ ] **2.2** Crear tabla `perfiles_usuario` vinculada a `auth.users`:
  ```sql
  CREATE TABLE perfiles_usuario (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_completo TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('admin', 'coordinador', 'supervisor', 'tecnico')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  ```
- [ ] **2.3** Implementar middleware de Next.js para protección de rutas
- [ ] **2.4** Crear páginas de autenticación:
  - `/login` — Inicio de sesión
  - `/registro` — Registro de nuevos usuarios (solo admin)
  - `/recuperar-contrasena` — Recuperación de contraseña
- [ ] **2.5** Crear hook personalizado `useAuth()` con Zustand:
  - Estado del usuario actual
  - Verificación de permisos por rol
  - Funciones de login/logout/refresh
- [ ] **2.6** Crear componente `<ProtectedRoute>` y `<RoleGate>`
- [ ] **2.7** Implementar helper de Supabase SSR para Server Components
- [ ] **2.8** Crear componente de perfil de usuario en el sidebar

### 6.2 Entregable
Sistema de autenticación funcional con login, protección de rutas por rol, y estado de sesión persistente.

### 6.3 ¿Por qué DeepSeek V4 Pro aquí?
La integración de Supabase Auth con Next.js App Router sigue patrones bien establecidos y documentados. DeepSeek V4 Pro:
- Conoce bien las APIs de Supabase Auth
- Genera código limpio y funcional rápidamente
- Maneja bien la integración frontend + backend
- No requiere razonamiento profundo, sino ejecución precisa

---

## 7. Fase 3 — Módulo de Catálogos (CRUD)
> **Duración estimada:** 5–7 días  
> **Modelo principal:** DeepSeek V4 Pro  
> **Modelo alternativo:** MiniMax M2.7

### 7.1 Tareas — Catálogo de Técnicos

- [ ] **3.1** Crear página `/catalogos/tecnicos` con tabla de datos:
  - Columnas: Nombre, RFC, Teléfono, Normas certificadas, Estado, Acciones
  - Búsqueda y filtrado por nombre/estado/norma
  - Paginación server-side
- [ ] **3.2** Crear diálogo modal para Crear/Editar técnico:
  - Campos: nombre, apellidos, RFC, teléfono, email, dirección
  - Selector múltiple de normas STPS que puede evaluar
  - Validación con Zod
- [ ] **3.3** Implementar soft-delete y cambio de estado
- [ ] **3.4** Crear vista de detalle del técnico con historial de servicios

### 7.2 Tareas — Catálogo de Vehículos

- [ ] **3.5** Crear página `/catalogos/vehiculos` con tabla de datos:
  - Columnas: Unidad, Marca, Modelo, Año, Placas, Estado, Km, Próximo mantenimiento
- [ ] **3.6** Crear diálogo modal para Crear/Editar vehículo:
  - Campos: número de unidad, marca, modelo, año, placas, color, VIN, km actual
  - Fecha de próximo mantenimiento (con alerta visual si está próximo)
  - Validación con Zod
- [ ] **3.7** Implementar registro de mantenimientos (sub-tabla)
- [ ] **3.8** Badge visual de estado del vehículo (disponible/mantenimiento/asignado)

### 7.3 Tareas — Catálogo de Equipos de Medición

- [ ] **3.9** Crear página `/catalogos/equipos` con tabla de datos:
  - Columnas: ID interno, Descripción, Marca, Modelo, N° Serie, Vigencia Calibración, Estado
- [ ] **3.10** Crear diálogo modal para Crear/Editar equipo:
  - Campos: ID interno, descripción, marca, modelo, número de serie
  - Fecha de última calibración y vigencia
  - Laboratorio de calibración
  - Certificado de calibración (upload a Supabase Storage)
  - Validación con Zod
- [ ] **3.11** Alerta visual automática cuando la calibración esté por vencer (≤30 días)
- [ ] **3.12** Alerta de bloqueo cuando la calibración esté vencida (no permite asignar)

### 7.4 Tareas — Catálogo de Normas STPS

- [ ] **3.13** Crear página `/catalogos/normas` con tabla de datos:
  - Columnas: Clave de norma, Nombre, Descripción, Equipos requeridos, Activa
- [ ] **3.14** CRUD para normas con relación a equipos necesarios

### 7.5 Tareas — Catálogo de Clientes

- [ ] **3.15** Crear página `/catalogos/clientes` con tabla de datos:
  - Columnas: Razón social, RFC, Contacto, Teléfono, Dirección, Servicios realizados
- [ ] **3.16** CRUD de clientes con validación de RFC
- [ ] **3.17** Vista de detalle con historial de órdenes de servicio

### 7.6 Tareas — Componentes Compartidos

- [ ] **3.18** Crear componente reutilizable `<DataTable>` con:
  - Ordenamiento por columnas
  - Filtrado global y por columna
  - Paginación configurable
  - Exportación a CSV/Excel
  - Selección de filas (checkbox)
- [ ] **3.19** Crear componente reutilizable `<FormDialog>` para modales CRUD
- [ ] **3.20** Crear componente `<StatusBadge>` con colores por estado
- [ ] **3.21** Crear hook reutilizable `useCRUD(tableName)` para operaciones estándar

### 7.7 Entregable
Cinco catálogos completamente funcionales con CRUD, búsqueda, filtrado, paginación y validación. Componentes reutilizables para todo el proyecto.

### 7.8 ¿Por qué DeepSeek V4 Pro aquí?
Esta fase tiene el **mayor volumen de código** del proyecto pero sigue patrones repetitivos (CRUD). DeepSeek V4 Pro:
- Es el modelo más eficiente en tokens para generación masiva de código
- Mantiene consistencia entre componentes similares
- Ejecuta bien patrones conocidos (formularios, tablas, modales)
- Su velocidad permite iterar rápidamente sobre 5 catálogos

---

## 8. Fase 4 — Motor de Validación de Conflictos
> **Duración estimada:** 4–5 días  
> **Modelo principal:** GLM-5.1 (implementación)  
> **Modelo de revisión:** Kimi K2.6  
> **Modelo alternativo:** Qwen 3.7 Max

### 8.1 Concepto del Motor

El motor de validación es el **corazón del sistema**. Antes de confirmar cualquier asignación, debe verificar:

```
┌─────────────────────────────────────────────────────────────┐
│              SOLICITUD DE ASIGNACIÓN                         │
│  OS #124 | 15-Jul-2026 08:00-17:00 | Cliente: ACME Corp    │
│  Técnico: Juan Pérez                                         │
│  Vehículo: Unidad 03                                         │
│  Equipos: Luxómetro LX-200, Sonómetro SN-400               │
└────────────────────────┬────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           MOTOR DE VALIDACIÓN DE CONFLICTOS                  │
│                                                               │
│  ✅ ¿Juan Pérez está libre el 15-Jul 08:00-17:00?           │
│  ✅ ¿Unidad 03 no tiene otro servicio ese día?               │
│  ✅ ¿Luxómetro LX-200 no está asignado a otra OS?           │
│  ✅ ¿Sonómetro SN-400 no está en calibración?               │
│  ✅ ¿La calibración de ambos equipos está vigente?           │
│  ✅ ¿Juan Pérez no tiene vacaciones/incapacidad?             │
│  ✅ ¿Unidad 03 no está en mantenimiento?                     │
│  ✅ ¿Juan Pérez está certificado para la norma evaluada?     │
│  ✅ ¿Los equipos son los requeridos por la norma?            │
└────────────────────────┬────────────────────────────────────┘
                         ▼
              ┌─────────────────────┐
              │  TODAS PASAN → ✅   │
              │  ALGUNA FALLA → ❌  │
              │  (Detalle del error) │
              └─────────────────────┘
```

### 8.2 Tareas

- [ ] **4.1** Diseñar interfaz TypeScript del motor de validación:
  ```typescript
  interface ValidacionResult {
    valido: boolean;
    errores: ConflictoDetectado[];
    advertencias: Advertencia[];
  }

  interface ConflictoDetectado {
    tipo: 'tecnico' | 'vehiculo' | 'equipo';
    recurso_id: string;
    recurso_nombre: string;
    motivo: 'ocupado' | 'bloqueado' | 'calibracion_vencida' | 'sin_certificacion' | 'equipo_no_requerido';
    conflicto_con?: string; // OS o bloqueo que causa el conflicto
    fecha_conflicto?: string;
    detalle: string;
  }
  ```
- [ ] **4.2** Implementar función `validarDisponibilidadTecnico()`:
  - Verificar contra `asignaciones_tecnicos` (¿tiene otra OS en esa fecha/hora?)
  - Verificar contra `bloqueos_recursos` (¿tiene vacaciones, incapacidad, etc.?)
  - Verificar certificaciones (¿está habilitado para la norma de la OS?)
- [ ] **4.3** Implementar función `validarDisponibilidadVehiculo()`:
  - Verificar contra `asignaciones_vehiculos`
  - Verificar contra `bloqueos_recursos` (mantenimiento, etc.)
  - Verificar estado general del vehículo
- [ ] **4.4** Implementar función `validarDisponibilidadEquipo()`:
  - Verificar contra `asignaciones_equipos`
  - Verificar contra `bloqueos_recursos` (calibración, préstamo, etc.)
  - Verificar vigencia de calibración a la fecha del servicio
  - Verificar que el equipo es requerido por la norma evaluada
- [ ] **4.5** Implementar función orquestadora `validarOrdenServicio()`:
  - Ejecuta todas las validaciones en paralelo
  - Consolida resultados
  - Retorna objeto `ValidacionResult`
- [ ] **4.6** Crear funciones PostgreSQL equivalentes (validación server-side como respaldo):
  - Trigger `BEFORE INSERT/UPDATE` en tablas de asignación
  - Función que lanza excepción si hay conflicto (doble capa de seguridad)
- [ ] **4.7** Implementar detección de **conflictos parciales** (advertencias):
  - Equipo con calibración próxima a vencer (<30 días) → advertencia amarilla
  - Técnico con muchos servicios en la semana (>4) → advertencia de sobrecarga
  - Vehículo con km alto → sugerir mantenimiento
- [ ] **4.8** Crear componente `<ConflictAlert>` para mostrar errores en la UI:
  - Lista de conflictos con ícono, recurso afectado y detalle
  - Distinción visual entre errores bloqueantes (rojo) y advertencias (amarillo)
  - Enlace directo al recurso o servicio en conflicto
- [ ] **4.9** Escribir tests unitarios exhaustivos del motor de validación:
  - Caso: técnico libre → ✅
  - Caso: técnico con OS solapada parcialmente → ❌
  - Caso: técnico con OS el mismo día pero diferente horario → ✅
  - Caso: equipo con calibración vencida → ❌
  - Caso: equipo en calibración (bloqueado) → ❌
  - Caso: vehículo en mantenimiento → ❌
  - Caso: asignación múltiple de equipos, uno con conflicto → ❌ parcial
  - Caso: rango de fechas multi-día con conflicto en un solo día → ❌

### 8.3 Entregable
Motor de validación completamente funcional, probado unitariamente con >95% de cobertura en los escenarios críticos, con validación tanto en cliente (TypeScript) como en servidor (PostgreSQL).

### 8.4 ¿Por qué GLM-5.1 aquí?
El motor de validación requiere **lógica temporal y matemática precisa** (comparación de rangos de fechas, detección de solapamientos, validación de estados). GLM-5.1:
- Tiene el razonamiento lógico/matemático más consistente
- Produce código con menos errores en lógica condicional
- Mantiene un estilo profesional y metódico

**¿Por qué Kimi K2.6 para revisión?** Los bugs en el motor de validación serían catastróficos (permitir doble asignación). Kimi K2.6:
- Cuestiona activamente cada condición
- Busca edge cases que el implementador pudo no considerar
- Razona sobre escenarios límite (medianoche, servicios multi-día, cambio de horario de verano, etc.)

---

## 9. Fase 5 — Módulo de Órdenes de Servicio
> **Duración estimada:** 5–6 días  
> **Modelo principal:** DeepSeek V4 Pro  
> **Modelo alternativo:** MiniMax M2.7

### 9.1 Tareas

- [ ] **5.1** Crear página `/ordenes-servicio` con listado de órdenes:
  - Tabla con columnas: Folio, Cliente, Norma(s), Fecha, Técnico(s), Estado, Acciones
  - Filtros por: estado, cliente, fecha, técnico
  - Ordenamiento y paginación
  - Badges de color por estado
- [ ] **5.2** Crear formulario de nueva orden de servicio (`/ordenes-servicio/nueva`):
  - **Paso 1 — Datos generales:**
    - Selección de cliente (combobox con búsqueda)
    - Dirección del servicio (puede diferir de la dirección del cliente)
    - Norma(s) a evaluar (multi-select)
    - Fecha y hora de inicio / fin programados
    - Observaciones
  - **Paso 2 — Asignación de recursos:**
    - Selector de técnico(s) con indicador de disponibilidad en tiempo real
    - Selector de vehículo con indicador de disponibilidad
    - Selector de equipo(s) de medición con indicador de disponibilidad y vigencia
    - Los equipos se pre-filtran según los requeridos por la(s) norma(s) seleccionada(s)
  - **Paso 3 — Confirmación:**
    - Resumen visual de la orden
    - Ejecución del motor de validación
    - Si hay errores: mostrar `<ConflictAlert>` y bloquear guardado
    - Si hay advertencias: mostrar y permitir guardado con confirmación
    - Si todo está limpio: guardar y confirmar
- [ ] **5.3** Crear vista de detalle de orden de servicio (`/ordenes-servicio/[id]`):
  - Información completa de la OS
  - Recursos asignados con sus estados
  - Timeline de cambios (historial de auditoría)
  - Botones de acción: Editar, Cancelar, Iniciar, Completar
- [ ] **5.4** Implementar flujo de estados de la OS:
  ```
  borrador → programada → en_curso → completada
                  ↓                       
              cancelada                   
  ```
- [ ] **5.5** Implementar edición de OS con re-validación de conflictos
- [ ] **5.6** Implementar cancelación con liberación automática de recursos
- [ ] **5.7** Crear componente `<ResourceAvailabilityIndicator>`:
  - 🟢 Disponible
  - 🟡 Disponible con advertencia
  - 🔴 No disponible (tooltip con motivo)
  - 🔵 Información (ej. calibración próxima a vencer)
- [ ] **5.8** Implementar notificaciones toast para acciones exitosas/fallidas

### 9.2 Entregable
Flujo completo de creación, edición, consulta y gestión de órdenes de servicio con validación de conflictos integrada.

### 9.3 ¿Por qué DeepSeek V4 Pro aquí?
Este módulo es el más **integrativo** del proyecto: combina UI compleja (stepper, selectors, indicadores), lógica de negocio (estados, validaciones), y operaciones de base de datos (transacciones, multi-tabla). DeepSeek V4 Pro:
- Maneja bien la integración full-stack
- Genera componentes React complejos con buen rendimiento
- Produce código coherente que integra todos los módulos previos

---

## 10. Fase 6 — Interfaz de Calendario Interactivo
> **Duración estimada:** 4–5 días  
> **Modelo principal:** DeepSeek V4 Pro  
> **Modelo alternativo:** MiniMax M2.5

### 10.1 Tareas

- [ ] **6.1** Crear página `/calendario` con FullCalendar integrado:
  - Vista mensual (dayGridMonth)
  - Vista semanal (timeGridWeek)
  - Vista diaria (timeGridDay)
  - Vista de agenda/lista (listWeek)
- [ ] **6.2** Configurar fuentes de eventos:
  - Órdenes de servicio (color según estado)
  - Bloqueos de técnicos (vacaciones, incapacidades) — color gris
  - Mantenimientos de vehículos — color naranja
  - Calibraciones de equipos — color morado
- [ ] **6.3** Implementar filtros laterales:
  - Por tipo de recurso (técnicos / vehículos / equipos)
  - Por recurso específico (ver calendario de Juan Pérez)
  - Por estado de OS
  - Por norma evaluada
- [ ] **6.4** Implementar interactividad:
  - Click en evento → abrir detalle de OS en panel lateral
  - Click en día vacío → iniciar creación de nueva OS con fecha pre-llenada
  - Drag & Drop para re-programar OS (con re-validación de conflictos)
  - Resize de evento para ajustar duración
- [ ] **6.5** Crear panel lateral `<EventDetailPanel>`:
  - Datos de la OS
  - Recursos asignados
  - Acciones rápidas (editar, cancelar)
- [ ] **6.6** Implementar "mini calendarios" por recurso:
  - Vista compacta del calendario de un técnico/vehículo/equipo específico
  - Útil al momento de asignar recursos (ver disponibilidad visual)
- [ ] **6.7** Personalizar estilos del calendario:
  - Colores consistentes con el tema del sistema
  - Indicadores visuales de carga (muchos servicios = color más intenso)
  - Diseño responsive para tablet/móvil
- [ ] **6.8** Implementar actualización en tiempo real (Supabase Realtime):
  - Suscribirse a cambios en `ordenes_servicio` y `asignaciones_*`
  - Actualizar el calendario automáticamente cuando otro usuario crea/modifica una OS

### 10.2 Entregable
Calendario interactivo completo con múltiples vistas, filtros, drag & drop, y actualización en tiempo real.

### 10.3 ¿Por qué DeepSeek V4 Pro aquí?
FullCalendar es una librería con API extensa y bien documentada. La tarea principal es integrarla correctamente con React y personalizar su comportamiento. DeepSeek V4 Pro:
- Tiene buen conocimiento de FullCalendar y sus plugins
- Maneja bien la integración de librerías de terceros con React
- Es eficiente para la personalización de estilos y comportamientos

---

## 11. Fase 7 — Gestión de Estados Temporales
> **Duración estimada:** 3–4 días  
> **Modelo principal:** MiMo-V2.5-Pro  
> **Modelo alternativo:** DeepSeek V4 Pro

### 11.1 Concepto

Los estados temporales permiten marcar un recurso como **no disponible** por un periodo específico, sin eliminarlo del sistema:

| Recurso | Motivos de Bloqueo |
|---------|-------------------|
| **Técnico** | Vacaciones, incapacidad, capacitación, permiso sin goce, comisión |
| **Vehículo** | Mantenimiento preventivo, mantenimiento correctivo, verificación, siniestro |
| **Equipo** | Calibración en laboratorio, préstamo, reparación, baja temporal |

### 11.2 Tareas

- [ ] **7.1** Crear página `/bloqueos` con listado de bloqueos activos y futuros:
  - Filtro por tipo de recurso y motivo
  - Indicador visual de bloqueos activos vs programados vs finalizados
- [ ] **7.2** Crear formulario de nuevo bloqueo:
  - Selector de tipo de recurso (técnico/vehículo/equipo)
  - Selector del recurso específico
  - Tipo de bloqueo (dropdown según tipo de recurso)
  - Fecha de inicio y fin
  - Observaciones
  - **Validación:** No permite crear bloqueo si el recurso tiene OS programadas en ese rango (muestra las OS afectadas y sugiere re-programarlas primero)
- [ ] **7.3** Integrar bloqueos con el calendario (eventos visuales diferenciados)
- [ ] **7.4** Crear alertas automáticas:
  - Equipo con calibración por vencer en ≤30 días → alerta en dashboard
  - Vehículo con mantenimiento programado en ≤7 días → alerta
  - Técnico con vacaciones próximas y OS asignadas → alerta de conflicto potencial
- [ ] **7.5** Crear vista rápida "Estado actual de recursos":
  - Panel tipo semáforo: cuántos técnicos/vehículos/equipos están disponibles vs bloqueados
  - Acceso directo desde el dashboard
- [ ] **7.6** Implementar finalización automática de bloqueos:
  - Job que marca bloqueos como finalizados cuando pasa la fecha de fin
  - Se puede implementar con Supabase Edge Functions (cron) o con lógica en la query

### 11.3 Entregable
Sistema completo de gestión de bloqueos/estados temporales integrado con el motor de validación y el calendario.

### 11.4 ¿Por qué MiMo-V2.5-Pro aquí?
Esta fase es un **módulo incremental** sobre un sistema ya existente. No requiere diseño desde cero sino agregar funcionalidad sobre las bases ya construidas. MiMo-V2.5-Pro:
- Excela en construcción de parches y módulos focalizados
- Entiende bien el contexto existente y agrega sin romper
- Es preciso en cambios parciales sobre código existente

---

## 12. Fase 8 — Dashboard y Reportes
> **Duración estimada:** 3–4 días  
> **Modelo principal:** DeepSeek V4 Pro  
> **Modelo alternativo:** MiniMax M2.7

### 12.1 Tareas

- [ ] **8.1** Crear página principal de dashboard (`/dashboard`):
  - **KPI Cards** (fila superior):
    - Servicios programados hoy
    - Servicios esta semana
    - Técnicos disponibles / total
    - Vehículos disponibles / total
    - Equipos disponibles / total
    - Equipos con calibración próxima a vencer
  - **Gráfico de barras:** Servicios por mes (últimos 6 meses)
  - **Gráfico circular:** Distribución de servicios por norma
  - **Gráfico de ocupación:** % de ocupación de técnicos por semana
  - **Lista:** Próximos 5 servicios programados
  - **Alertas activas:** Calibraciones por vencer, mantenimientos pendientes
- [ ] **8.2** Crear componente `<KPICard>` con:
  - Valor principal
  - Comparativa vs periodo anterior (▲ ▼)
  - Ícono y color temático
  - Animación de entrada
- [ ] **8.3** Implementar gráficos con Recharts:
  - `<BarChart>` para servicios por mes
  - `<PieChart>` para distribución por norma
  - `<AreaChart>` para tendencia de ocupación
- [ ] **8.4** Crear módulo de reportes (`/reportes`):
  - **Reporte de utilización de técnicos:** Servicios por técnico, horas trabajadas
  - **Reporte de flotilla:** Km recorridos por vehículo, mantenimientos realizados
  - **Reporte de equipos:** Uso por equipo, historial de calibraciones
  - **Reporte de clientes:** Servicios por cliente, normas evaluadas
- [ ] **8.5** Implementar exportación de reportes:
  - Exportar a CSV
  - Exportar a PDF (usando html2canvas + jsPDF o similar)
- [ ] **8.6** Implementar filtros de rango de fechas para todos los reportes
- [ ] **8.7** Crear widget de "actividad reciente" (últimas acciones del sistema)

### 12.2 Entregable
Dashboard con KPIs en tiempo real, gráficos interactivos, módulo de reportes con exportación y filtros.

### 12.3 ¿Por qué DeepSeek V4 Pro aquí?
El dashboard combina componentes visuales (gráficos) con queries de agregación a la base de datos. DeepSeek V4 Pro:
- Maneja bien las APIs de Recharts y librerías de visualización
- Genera queries de agregación eficientes
- Produce UIs visualmente atractivas

---

## 13. Fase 9 — Pruebas, QA y Optimización
> **Duración estimada:** 3–4 días  
> **Modelo principal:** Kimi K2.6 (revisión crítica)  
> **Modelo de ejecución:** DeepSeek V4 Pro (correcciones)  
> **Modelo auxiliar:** DeepSeek V4 Flash (exploración rápida)

### 13.1 Tareas

- [ ] **9.1** Escribir tests unitarios (Vitest) para:
  - Motor de validación de conflictos (>95% cobertura)
  - Funciones helper de fechas y utilidades
  - Hooks personalizados (useAuth, useCRUD)
- [ ] **9.2** Escribir tests de integración para:
  - Flujo completo de creación de OS con validación
  - CRUD de cada catálogo
  - Autenticación y autorización
- [ ] **9.3** Testing E2E con Playwright:
  - Flujo de login → crear OS → verificar en calendario
  - Intentar asignación con conflicto → verificar bloqueo
  - Crear bloqueo → verificar que no permite asignar recurso
- [ ] **9.4** Code review completo del motor de validación con Kimi K2.6:
  - Revisar cada condición de conflicto
  - Buscar edge cases no cubiertos
  - Verificar seguridad (¿se puede bypass la validación?)
- [ ] **9.5** Optimización de rendimiento:
  - Auditar queries lentas (Supabase Dashboard → Query Performance)
  - Implementar índices faltantes
  - Optimizar re-renders en React (React.memo, useMemo)
  - Lazy loading de páginas y componentes pesados
- [ ] **9.6** Pruebas de accesibilidad (a11y):
  - Verificar navegación con teclado
  - Verificar contraste de colores
  - Verificar labels de formularios
- [ ] **9.7** Pruebas de responsividad:
  - Desktop (1920x1080, 1366x768)
  - Tablet (768x1024)
  - Móvil (375x667) — al menos navegable
- [ ] **9.8** Corregir todos los bugs encontrados
- [ ] **9.9** Documentar bugs conocidos y limitaciones

### 13.2 Entregable
Suite de tests funcional, código optimizado, bugs corregidos, reporte de QA documentado.

### 13.3 ¿Por qué Kimi K2.6 aquí?
La fase de QA requiere un enfoque **escéptico y cuestionador**. Kimi K2.6:
- No asume que el código está bien; cuestiona cada decisión
- Busca activamente edge cases y escenarios de fallo
- Es excelente para encontrar vulnerabilidades lógicas
- Tiende a preguntar "¿qué pasa si...?" antes de aprobar

**¿Por qué DeepSeek V4 Flash para exploración?** Al revisar código existente y buscar patrones, Flash es ultrarrápido para navegar el codebase, hacer grep y entender el contexto sin gastar tokens costosos.

---

## 14. Fase 10 — Despliegue y Puesta en Producción
> **Duración estimada:** 2–3 días  
> **Modelo principal:** DeepSeek V4 Flash  
> **Modelo alternativo:** DeepSeek V4 Pro

### 14.1 Tareas

- [ ] **10.1** Configurar proyecto en Vercel:
  - Conectar repositorio de GitHub
  - Configurar variables de entorno (SUPABASE_URL, SUPABASE_ANON_KEY, etc.)
  - Configurar dominio personalizado (si aplica)
- [ ] **10.2** Configurar Supabase para producción:
  - Revisar y ajustar políticas RLS
  - Habilitar solo los métodos de auth necesarios
  - Configurar rate limiting
  - Configurar backups automáticos
- [ ] **10.3** Optimizar bundle de producción:
  - Analizar bundle con `@next/bundle-analyzer`
  - Eliminar dependencias no utilizadas
  - Verificar tree-shaking
- [ ] **10.4** Configurar monitoreo:
  - Vercel Analytics (rendimiento frontend)
  - Supabase Dashboard (queries, auth, storage)
  - Implementar error boundary global
- [ ] **10.5** Crear documentación de usuario:
  - Guía rápida de uso del sistema
  - Manual para el administrador
  - FAQ de problemas comunes
- [ ] **10.6** Crear script de seed data para producción (datos reales iniciales)
- [ ] **10.7** Realizar prueba de humo (smoke test) en producción
- [ ] **10.8** Capacitar a usuarios finales

### 14.2 Entregable
Aplicación desplegada en producción, accesible vía URL, con monitoreo activo y documentación de usuario.

### 14.3 ¿Por qué DeepSeek V4 Flash aquí?
El despliegue involucra tareas de configuración, lectura de documentación y ejecución de comandos. No requiere razonamiento profundo sino velocidad y precisión en tareas operativas. DeepSeek V4 Flash:
- Es el modelo más rápido disponible
- Perfecto para tareas de DevOps y configuración
- Bajo costo en tokens para tareas de alto volumen de lectura

---

## 15. Esquema de Base de Datos Detallado

### 15.1 Diagrama Entidad-Relación

```
┌──────────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│    clientes       │     │   ordenes_servicio    │     │   normas_stps    │
├──────────────────┤     ├──────────────────────┤     ├──────────────────┤
│ id (PK)          │◄────│ cliente_id (FK)       │     │ id (PK)          │
│ razon_social     │     │ id (PK)               │     │ clave            │
│ rfc              │     │ folio                 │     │ nombre           │
│ contacto_nombre  │     │ fecha_inicio          │     │ descripcion      │
│ contacto_tel     │     │ fecha_fin             │     │ activa           │
│ contacto_email   │     │ direccion_servicio    │     └────────┬─────────┘
│ direccion        │     │ estado                │              │
│ activo           │     │ observaciones         │              │
└──────────────────┘     │ created_by (FK→auth)  │              │
                         │ created_at            │              │
                         │ updated_at            │              │
                         └───┬──────┬───────┬────┘              │
                             │      │       │                   │
              ┌──────────────┘      │       └──────────────┐    │
              ▼                     ▼                      ▼    │
┌─────────────────────┐ ┌──────────────────┐ ┌────────────────────────┐
│asignaciones_tecnicos│ │asignaciones_veh. │ │  asignaciones_equipos  │
├─────────────────────┤ ├──────────────────┤ ├────────────────────────┤
│ id (PK)             │ │ id (PK)          │ │ id (PK)                │
│ orden_servicio_id   │ │ orden_serv_id    │ │ orden_servicio_id (FK) │
│ tecnico_id (FK)     │ │ vehiculo_id (FK) │ │ equipo_id (FK)         │
└────────┬────────────┘ └────────┬─────────┘ └────────┬───────────────┘
         │                       │                     │
         ▼                       ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐
│    tecnicos       │  │    vehiculos      │  │  equipos_medicion    │
├──────────────────┤  ├──────────────────┤  ├──────────────────────┤
│ id (PK)          │  │ id (PK)          │  │ id (PK)              │
│ nombre           │  │ numero_unidad    │  │ id_interno           │
│ apellidos        │  │ marca            │  │ descripcion          │
│ rfc              │  │ modelo           │  │ marca                │
│ telefono         │  │ anio             │  │ modelo               │
│ email            │  │ placas           │  │ numero_serie         │
│ estado           │  │ color            │  │ fecha_calibracion    │
│ activo           │  │ vin              │  │ vigencia_calibracion │
└──────────────────┘  │ km_actual        │  │ lab_calibracion      │
         │            │ estado           │  │ certificado_url      │
         │            │ prox_mantto      │  │ estado               │
         │            │ activo           │  │ activo               │
         │            └──────────────────┘  └──────────────────────┘
         │                     │                       │
         │            ┌───────┘                        │
         ▼            ▼                                ▼
┌────────────────────────────────────────────────────────────┐
│                   bloqueos_recursos                        │
├────────────────────────────────────────────────────────────┤
│ id (PK)                                                    │
│ tipo_recurso ('tecnico' | 'vehiculo' | 'equipo')           │
│ recurso_id (UUID) — referencia polimórfica                 │
│ tipo_bloqueo (ENUM)                                        │
│ fecha_inicio (TIMESTAMPTZ)                                 │
│ fecha_fin (TIMESTAMPTZ)                                    │
│ observaciones (TEXT)                                        │
│ created_by (FK → auth.users)                               │
│ created_at (TIMESTAMPTZ)                                   │
└────────────────────────────────────────────────────────────┘

┌──────────────────────┐          ┌──────────────────────┐
│ tecnico_normas (M:M) │          │  norma_equipos (M:M) │
├──────────────────────┤          ├──────────────────────┤
│ tecnico_id (FK)      │          │ norma_id (FK)        │
│ norma_id (FK)        │          │ equipo_tipo (TEXT)    │
└──────────────────────┘          │ cantidad_requerida   │
                                  └──────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                   ordenes_normas (M:M)                     │
├────────────────────────────────────────────────────────────┤
│ orden_servicio_id (FK)                                     │
│ norma_id (FK)                                              │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                   historial_cambios                         │
├────────────────────────────────────────────────────────────┤
│ id (PK)                                                    │
│ tabla_afectada (TEXT)                                       │
│ registro_id (UUID)                                         │
│ accion ('INSERT' | 'UPDATE' | 'DELETE')                    │
│ datos_anteriores (JSONB)                                   │
│ datos_nuevos (JSONB)                                       │
│ usuario_id (FK → auth.users)                               │
│ created_at (TIMESTAMPTZ)                                   │
└────────────────────────────────────────────────────────────┘
```

### 15.2 Índices Críticos

```sql
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
```

---

## 16. Estructura de Archivos del Proyecto

```
006_LOGISTICA/
├── PLAN.md                              ← Este documento
├── .env.local                           ← Variables de entorno (no versionado)
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── components.json                      ← Configuración shadcn/ui
│
├── public/
│   ├── favicon.ico
│   └── logo.svg
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_enums.sql
│   │   ├── 002_create_tables.sql
│   │   ├── 003_create_indexes.sql
│   │   ├── 004_create_rls_policies.sql
│   │   ├── 005_create_functions.sql
│   │   ├── 006_create_triggers.sql
│   │   └── 007_create_views.sql
│   └── seed.sql
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                   ← Layout raíz con providers
│   │   ├── page.tsx                     ← Redirect a /dashboard
│   │   ├── globals.css
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── registro/page.tsx
│   │   │   └── recuperar-contrasena/page.tsx
│   │   │
│   │   ├── (app)/                       ← Layout con sidebar (rutas protegidas)
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   │
│   │   │   ├── ordenes-servicio/
│   │   │   │   ├── page.tsx             ← Listado de OS
│   │   │   │   ├── nueva/page.tsx       ← Crear nueva OS
│   │   │   │   └── [id]/page.tsx        ← Detalle de OS
│   │   │   │
│   │   │   ├── calendario/page.tsx
│   │   │   │
│   │   │   ├── catalogos/
│   │   │   │   ├── tecnicos/page.tsx
│   │   │   │   ├── vehiculos/page.tsx
│   │   │   │   ├── equipos/page.tsx
│   │   │   │   ├── normas/page.tsx
│   │   │   │   └── clientes/page.tsx
│   │   │   │
│   │   │   ├── bloqueos/page.tsx
│   │   │   │
│   │   │   └── reportes/
│   │   │       ├── page.tsx
│   │   │       ├── tecnicos/page.tsx
│   │   │       ├── vehiculos/page.tsx
│   │   │       └── equipos/page.tsx
│   │   │
│   │   └── api/                         ← API Routes para lógica pesada
│   │       ├── validar-disponibilidad/route.ts
│   │       └── reportes/route.ts
│   │
│   ├── components/
│   │   ├── ui/                          ← Componentes shadcn/ui (auto-generados)
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── UserMenu.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── DataTable.tsx
│   │   │   ├── FormDialog.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── ConflictAlert.tsx
│   │   │   ├── ResourceAvailabilityIndicator.tsx
│   │   │   ├── KPICard.tsx
│   │   │   ├── DateRangePicker.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   ├── catalogos/
│   │   │   ├── TecnicoForm.tsx
│   │   │   ├── VehiculoForm.tsx
│   │   │   ├── EquipoForm.tsx
│   │   │   ├── NormaForm.tsx
│   │   │   └── ClienteForm.tsx
│   │   │
│   │   ├── ordenes/
│   │   │   ├── OrdenForm.tsx            ← Formulario stepper
│   │   │   ├── OrdenDetail.tsx
│   │   │   ├── ResourceSelector.tsx
│   │   │   └── OrdenTimeline.tsx
│   │   │
│   │   ├── calendario/
│   │   │   ├── CalendarView.tsx
│   │   │   ├── CalendarFilters.tsx
│   │   │   ├── EventDetailPanel.tsx
│   │   │   └── MiniCalendar.tsx
│   │   │
│   │   └── dashboard/
│   │       ├── StatsCards.tsx
│   │       ├── ServiciosChart.tsx
│   │       ├── OcupacionChart.tsx
│   │       ├── AlertasList.tsx
│   │       └── ActividadReciente.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                ← Cliente browser
│   │   │   ├── server.ts                ← Cliente server (SSR)
│   │   │   └── middleware.ts            ← Helper para middleware
│   │   │
│   │   ├── validations/
│   │   │   ├── motor-validacion.ts      ← Motor de validación principal
│   │   │   ├── validar-tecnico.ts
│   │   │   ├── validar-vehiculo.ts
│   │   │   ├── validar-equipo.ts
│   │   │   └── tipos.ts                 ← Tipos del motor
│   │   │
│   │   ├── schemas/                     ← Schemas Zod para formularios
│   │   │   ├── tecnico.schema.ts
│   │   │   ├── vehiculo.schema.ts
│   │   │   ├── equipo.schema.ts
│   │   │   ├── norma.schema.ts
│   │   │   ├── cliente.schema.ts
│   │   │   ├── orden-servicio.schema.ts
│   │   │   └── bloqueo.schema.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── fechas.ts                ← Utilidades de fecha con date-fns
│   │   │   ├── formato.ts              ← Formateo de texto, moneda, etc.
│   │   │   └── exportar.ts             ← Exportación CSV/PDF
│   │   │
│   │   └── constants.ts                ← Constantes del sistema
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCRUD.ts
│   │   ├── useValidacion.ts
│   │   └── useRealtimeSubscription.ts
│   │
│   ├── stores/
│   │   ├── auth-store.ts
│   │   ├── calendar-store.ts
│   │   └── ui-store.ts
│   │
│   ├── types/
│   │   ├── database.types.ts            ← Auto-generado desde Supabase
│   │   └── index.ts                     ← Tipos adicionales de la app
│   │
│   └── middleware.ts                    ← Middleware de Next.js (auth)
│
└── tests/
    ├── unit/
    │   ├── motor-validacion.test.ts
    │   ├── validar-tecnico.test.ts
    │   ├── validar-vehiculo.test.ts
    │   ├── validar-equipo.test.ts
    │   └── utils.test.ts
    │
    ├── integration/
    │   ├── ordenes-servicio.test.ts
    │   └── catalogos.test.ts
    │
    └── e2e/
        ├── login.spec.ts
        ├── crear-orden.spec.ts
        └── calendario.spec.ts
```

---

## 17. Cronograma Visual (Gantt)

```
Semana:   │ S1  │ S2  │ S3  │ S4  │ S5  │ S6  │ S7  │ S8  │ S9  │ S10 │
──────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
F0 Prep   │████ │     │     │     │     │     │     │     │     │     │
F1 BD     │ ██  │████ │     │     │     │     │     │     │     │     │
F2 Auth   │     │ ██  │██   │     │     │     │     │     │     │     │
F3 CRUD   │     │     │████ │████ │██   │     │     │     │     │     │
F4 Motor  │     │     │     │ ██  │████ │██   │     │     │     │     │
F5 OS     │     │     │     │     │ ██  │████ │████ │     │     │     │
F6 Calend │     │     │     │     │     │  ██ │████ │██   │     │     │
F7 Bloq   │     │     │     │     │     │     │ ██  │████ │     │     │
F8 Dash   │     │     │     │     │     │     │     │████ │██   │     │
F9 QA     │     │     │     │     │     │     │     │  ██ │████ │     │
F10 Deploy│     │     │     │     │     │     │     │     │ ██  │████ │
──────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
```

> **Nota:** Las fases se solapan ligeramente porque algunos componentes compartidos se reutilizan entre módulos. El camino crítico es: F0 → F1 → F4 → F5 → F6 → F9 → F10.

### 17.1 Hitos Clave

| Hito | Fecha Objetivo | Criterio de Éxito |
|------|---------------|-------------------|
| **M1: Infraestructura lista** | Fin Semana 2 | BD creada, auth funcional, proyecto corriendo |
| **M2: Catálogos completos** | Fin Semana 5 | 5 catálogos CRUD funcionales con datos de prueba |
| **M3: Motor validación operativo** | Fin Semana 6 | Tests unitarios pasando, 0 dobles asignaciones |
| **M4: Órdenes de servicio funcionales** | Fin Semana 7 | Flujo completo crear → validar → guardar → completar |
| **M5: Calendario operativo** | Fin Semana 8 | Vista calendario con drag & drop y realtime |
| **M6: MVP Completo** | Fin Semana 9 | Dashboard, reportes y bloqueos funcionales |
| **M7: Producción** | Fin Semana 10 | Desplegado, probado y documentado |

---

## 18. Riesgos y Mitigaciones

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|-------------|---------|------------|
| R1 | Schema de BD requiere cambios después de iniciar frontend | Alta | Alto | Diseñar schema con Qwen 3.7 Max + revisión con Kimi K2.6 antes de tocar frontend. Usar migraciones incrementales. |
| R2 | Motor de validación deja pasar conflictos (bug crítico) | Media | Crítico | Doble validación (cliente + servidor). Tests exhaustivos. Code review con Kimi K2.6. |
| R3 | FullCalendar no soporta alguna funcionalidad requerida | Baja | Medio | Evaluar alternativas (react-big-calendar). Priorizar funcionalidades core sobre nice-to-have. |
| R4 | Rendimiento degradado con muchos registros | Media | Medio | Paginación server-side desde el inicio. Índices optimizados. Vistas materializadas para queries pesadas. |
| R5 | Complejidad del formulario de OS genera bugs de UX | Alta | Medio | Implementar con stepper claro. Guardar borradores. Validación en cada paso. |
| R6 | Supabase free tier limitaciones | Baja | Bajo | El uso esperado está bien dentro de los límites. Plan Pro disponible ($25/mes) si se necesita escalar. |
| R7 | Cambios de requerimientos a mitad del proyecto | Media | Alto | Arquitectura modular que permite agregar/modificar módulos sin reescribir. |

---

## 19. Criterios de Aceptación por Módulo

### 19.1 Catálogos
- ✅ CRUD completo para las 5 entidades
- ✅ Búsqueda y filtrado funcional
- ✅ Validación de formularios (campos requeridos, formato RFC, etc.)
- ✅ No permite eliminar recursos con OS activas asignadas
- ✅ Alerta visual de calibración por vencer

### 19.2 Motor de Validación
- ✅ Detecta y bloquea 100% de conflictos de solapamiento temporal
- ✅ Detecta equipos con calibración vencida
- ✅ Detecta recursos con bloqueos activos
- ✅ Verifica certificaciones técnico ↔ norma
- ✅ Todos los tests unitarios pasan
- ✅ Validación redundante en servidor (PostgreSQL)

### 19.3 Órdenes de Servicio
- ✅ Flujo completo: borrador → programada → en_curso → completada
- ✅ Indicadores de disponibilidad en tiempo real al asignar recursos
- ✅ No permite guardar OS con conflictos
- ✅ Cancelación libera recursos automáticamente
- ✅ Historial de cambios trazable

### 19.4 Calendario
- ✅ Tres vistas funcionales (mes, semana, día)
- ✅ Filtros por recurso y estado
- ✅ Click en evento abre detalle
- ✅ Drag & drop re-programa con validación
- ✅ Actualización en tiempo real

### 19.5 Dashboard
- ✅ KPIs actualizados en tiempo real
- ✅ Gráficos funcionales con datos reales
- ✅ Alertas de calibración y mantenimiento visibles
- ✅ Exportación de reportes (CSV mínimo)

---

## 20. Glosario

| Término | Definición |
|---------|-----------|
| **OS** | Orden de Servicio — unidad central de trabajo del sistema |
| **STPS** | Secretaría del Trabajo y Previsión Social (México) |
| **NOM** | Norma Oficial Mexicana |
| **RLS** | Row Level Security — políticas de seguridad a nivel de fila en PostgreSQL |
| **CRUD** | Create, Read, Update, Delete — operaciones básicas de datos |
| **FSM** | Field Service Management — software de gestión de servicios en campo |
| **BaaS** | Backend as a Service — Supabase provee backend sin servidor propio |
| **Bloqueo** | Estado temporal de no disponibilidad de un recurso |
| **Motor de Validación** | Algoritmo que verifica disponibilidad de recursos antes de confirmar asignaciones |
| **Conflicto** | Situación donde un recurso sería asignado a dos servicios simultáneos |
| **Calibración** | Proceso periódico obligatorio para instrumentos de medición |

---

## 📌 Resumen de Modelos de IA — Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MODELO → TAREA (Guía Rápida)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🏗️  Qwen 3.7 Max ───── Arquitectura, Schema BD, decisiones       │
│                           críticas de diseño                        │
│                                                                     │
│  ⚙️  DeepSeek V4 Pro ── Implementación de código (caballo de       │
│                           batalla principal), integración full-stack │
│                                                                     │
│  🧮  GLM-5.1 ────────── Algoritmos, lógica temporal/matemática,    │
│                           motor de validación de conflictos          │
│                                                                     │
│  🔍  Kimi K2.6 ─────── Code review, QA, encontrar edge cases,     │
│                           cuestionar decisiones de diseño            │
│                                                                     │
│  🩹  MiMo-V2.5-Pro ──── Parches, módulos incrementales,            │
│                           ajustes sobre código existente             │
│                                                                     │
│  ⚡  DeepSeek V4 Flash ─ Exploración de código, configuración,     │
│                           tareas rápidas, deploy                     │
│                                                                     │
│  🔧  MiniMax M2.7 ───── Alternativa full-stack sólida cuando       │
│                           DeepSeek V4 Pro no esté disponible         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

> **Próximo paso:** Revisar y aprobar este plan. Una vez aprobado, comenzamos con la **Fase 0 — Preparación del Entorno** usando **DeepSeek V4 Pro**.

---
*Plan generado el 12 de Junio de 2026 — Sistema Integrado de Control Logístico STPS*
