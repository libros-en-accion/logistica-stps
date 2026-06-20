# Guía de Instalación y Despliegue — STPS Logística

> Versión: 1.1 — Actualizada post-despliegue

---

## Requisitos

- Node.js >= 20.9
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Cuenta en [GitHub](https://github.com) (gratuita)
- Cuenta en [Vercel](https://vercel.com) (gratuita, para despliegue)
- Token de acceso personal de GitHub con scope `repo`

---

## 1. Instalación local (desarrollo)

### 1.1 Clonar e instalar

```bash
git clone <repo-url>
cd 006_LOGISTICA
npm install
```

### 1.2 Variables de entorno

```bash
cp .env.example .env.local
# Editar con los valores de tu proyecto Supabase
```

### 1.3 Iniciar servidor

```bash
npm run dev
# Abrir http://localhost:3000
```

---

## 2. Configurar Supabase

### 2.1 Crear proyecto

1. Ve a [supabase.com](https://supabase.com) y crea cuenta (o inicia sesión con GitHub)
2. En el dashboard, haz clic en **"New project"**
3. Configura:
   - **Name:** `logistica-stps`
   - **Database Password:** Anótala
   - **Region:** La más cercana (us-east-1)
   - **Pricing Plan:** Free tier
4. Espera 1-2 minutos a que se cree el proyecto

### 2.2 Obtener credenciales

- **Project ID:** Ve a **Settings → General** (aparece al inicio)
- **Project URL:** `https://<PROJECT_ID>.supabase.co`
- **Anon Key:** Ve a **Settings → API Keys**, copia la clave `anon` (empieza con `eyJ...`)

### 2.3 Configurar `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_ID>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
```

### 2.4 Ejecutar migraciones SQL

Ve al **SQL Editor** de Supabase (icono `>` en barra lateral).

Crea una **nueva query** (botón "+") y pega el contenido de los archivos en orden:

| Orden | Archivo | Descripción |
|-------|---------|-------------|
| 1 | `supabase/migrations/001_create_enums.sql` | ENUMs |
| 2 | `supabase/migrations/002_create_tables.sql` | Tablas |
| 3 | `supabase/migrations/003_create_indexes.sql` | Índices |
| 4 | `supabase/migrations/004_create_rls_policies.sql` | RLS |
| 5 | `supabase/migrations/005_create_functions.sql` | Funciones |
| 6 | `supabase/migrations/006_create_triggers.sql` | Triggers |
| 7 | `supabase/migrations/007_create_views.sql` | Vistas |
| 8 | `supabase/seed.sql` | Datos de prueba |

**Nota:** Si los ENUMs ya existen, envuélvelos en DO blocks:

```sql
DO $$ BEGIN
  CREATE TYPE estado_os AS ENUM ('borrador','programada','en_curso','completada','cancelada');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
```

Si `CREATE TRIGGER IF NOT EXISTS` falla, usa:

```sql
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_auditoria_clientes') THEN
    CREATE TRIGGER trg_auditoria_clientes AFTER INSERT OR UPDATE OR DELETE ON clientes FOR EACH ROW EXECUTE FUNCTION fn_auditoria_trigger();
  END IF;
END $$;
```

Para el trigger de auditoría, la función necesita cast explícito:

```sql
CASE TG_OP WHEN 'DELETE' THEN 'DELETE'::accion_auditoria WHEN 'UPDATE' THEN 'UPDATE'::accion_auditoria ELSE 'INSERT'::accion_auditoria END
```

### 2.5 Script automatizado

```bash
bash supabase/setup.sh <PROJECT_ID>
```

---

## 3. Subir código a GitHub

### 3.1 Crear repositorio

1. Ve a [github.com/new](https://github.com/new)
2. **Repository name:** `logistica-stps`
3. **Privacy:** Public (recomendado) o Private
4. **NO marques** "Add a README", ".gitignore" ni "License"
5. Crea el repositorio

### 3.2 Conectar y subir

```bash
# Si es la primera vez:
git remote add origin https://github.com/<USUARIO>/logistica-stps.git

# Si ya tienes un remote:
git remote set-url origin https://github.com/<USUARIO>/logistica-stps.git

# Subir código:
git push -u origin main
```

Te pedirá:
- **Username:** tu usuario de GitHub
- **Password:** un **Personal Access Token** (no tu contraseña)

Para generar el token:
1. Ve a [github.com/settings/tokens](https://github.com/settings/tokens)
2. **Generate new token (classic)**
3. Scope: **`repo`**
4. Copia el token (comienza con `ghp_...`)

---

## 4. Desplegar en Vercel

### 4.1 Importar proyecto

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Inicia sesión con GitHub (recomendado)
3. Importa el repositorio `logistica-stps`
4. **Framework:** Next.js (se detecta automáticamente)

### 4.2 Variables de entorno

En la pantalla de configuración, agrega:

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<PROJECT_ID>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<ANON_KEY>` |

Asegúrate de que estén asignadas al **environment "Production"**.

### 4.3 Deploy

Haz clic en **"Deploy"**. Vercel construirá y publicará el proyecto.

**URL asignada:** `https://logistica-stps.vercel.app`

### 4.4 Redeploy después de cambios

Si modificas variables de entorno en **Settings → Environment Variables**, ve a **Deployments** → últimos 3 puntos → **Redeploy**.

---

## 5. Crear primer usuario administrador

1. Abre la URL del proyecto (local o Vercel)
2. Ve a `/registro`
3. Completa: nombre, email, contraseña, rol **Administrador**
4. Ve al **SQL Editor** de Supabase y ejecuta:

```sql
UPDATE perfiles_usuario
SET rol = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'tu-email@ejemplo.com');
```

5. Inicia sesión en `/login`

---

## 6. Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (localhost:3000) |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción local |
| `npm run lint` | ESLint |
| `npm test` | Tests unitarios + integración |
| `npm run test:watch` | Tests en modo watch |

---

## 7. Flujo de trabajo recomendado

```
Desarrollo local:
  1. npm run dev
  2. Hacer cambios en el código
  3. git add -A && git commit -m "mensaje"
  4. git push origin main
  5. Vercel detecta el push y redeploya automáticamente

Modificar BD:
  1. Crear migración en supabase/migrations/
  2. Ejecutar en SQL Editor de Supabase
  3. Commit + push
```

---

## 8. Solución de problemas comunes

| Problema | Solución |
|----------|----------|
| `<button> cannot be a descendant of <button>` | DropdownMenuTrigger de base-ui renderiza button, no anidar otro Button dentro |
| `Failed to execute 'fetch'` | REVISAR variables de entorno en Vercel |
| `type "estado_os" already exists` | Usar DO block con EXCEPTION WHEN duplicate_object |
| `column "email" does not exist` | perfiles_usuario no tiene email, usar auth.users |

## 9. Bugs conocidos

Ver `docs/BUGS.md` para limitaciones actuales.

---

*Documento generado el 19 de Junio de 2026*
