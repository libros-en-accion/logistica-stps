#!/usr/bin/env bash
# setup.sh — Script de configuración para el Sistema STPS Logística
# Uso: bash supabase/setup.sh <SUPABASE_PROJECT_ID>

set -e

PROJECT_ID=$1

if [ -z "$PROJECT_ID" ]; then
  echo "Uso: bash supabase/setup.sh <SUPABASE_PROJECT_ID>"
  echo "Ejemplo: bash supabase/setup.sh abcdefghijklmnopqrst"
  exit 1
fi

echo "=== Setup STPS Logística ==="
echo ""

# 1. Verificar dependencias
echo "1. Verificando npx..."
if ! command -v npx &> /dev/null; then
  echo "ERROR: npx no encontrado. Instala Node.js >= 20.9"
  exit 1
fi

# 2. Ejecutar migraciones en orden
echo "2. Ejecutando migraciones..."
for f in supabase/migrations/0*.sql; do
  echo "   - $(basename $f)..."
  npx supabase db push --project-id "$PROJECT_ID" --file "$f" || true
done

# 3. Seed data
echo "3. Insertando datos semilla..."
npx supabase db push --project-id "$PROJECT_ID" --file supabase/seed.sql || true

# 4. Generar tipos TypeScript
echo "4. Generando tipos TypeScript..."
npx supabase gen types typescript --project-id "$PROJECT_ID" > src/types/database.types.ts

# 5. Poblar .env.example si no existe .env.local
if [ ! -f .env.local ]; then
  echo "5. Creando .env.local desde .env.example..."
  cp .env.example .env.local
  echo ""
  echo "⚠️  Edita .env.local con las credenciales de tu proyecto Supabase:"
  echo "   NEXT_PUBLIC_SUPABASE_URL=https://$PROJECT_ID.supabase.co"
  echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>"
fi

echo ""
echo "=== Setup completado ==="
echo "Ejecuta 'npm run dev' para iniciar el servidor de desarrollo."
echo "Visita http://localhost:3000"
