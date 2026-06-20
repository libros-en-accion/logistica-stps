# Sistema STPS Logística — Guía de Instalación

## Requisitos

- Node.js >= 20.9
- Cuenta en [Supabase](https://supabase.com) (free tier)
- Cuenta en [Vercel](https://vercel.com) (free tier, opcional)

## Instalación local

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd 006_LOGISTICA

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con los valores de Supabase

# 4. Ejecutar migraciones en Supabase SQL Editor
# Abrir supabase/migrations/ en orden numérico:
#   001_create_enums.sql
#   002_create_tables.sql
#   003_create_indexes.sql
#   004_create_rls_policies.sql
#   005_create_functions.sql
#   006_create_triggers.sql
#   007_create_views.sql
#    seed.sql

# 5. Iniciar servidor de desarrollo
npm run dev
# Abrir http://localhost:3000

# 6. Crear primer usuario (admin)
# Registrarse en /registro
# Luego en Supabase SQL Editor:
#   UPDATE perfiles_usuario SET rol = 'admin' WHERE email = 'tu-email';
```

## Despliegue en Vercel

```bash
# 1. Subir a GitHub
git push origin main

# 2. En Vercel Dashboard:
#    - Importar repositorio
#    - Framework: Next.js
#    - Variables de entorno:
#      NEXT_PUBLIC_SUPABASE_URL=<url>
#      NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
#    - Deploy

# 3. En Supabase Dashboard:
#    - Project Settings > API > copiar URL y anon key
#    - SQL Editor > ejecutar migraciones (paso 4 arriba)
```

## Scripts disponibles

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm test` | Tests unitarios + integración |

## Migraciones SQL

Las migraciones están en `supabase/migrations/` y deben ejecutarse en orden
numérico (001 → 007), seguidas de `seed.sql` para datos de prueba.

## Variables de entorno

| Variable | Descripción |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `NEXT_PUBLIC_APP_URL` | URL de la app (opcional) |
