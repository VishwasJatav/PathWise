#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  DATABASE_URL=$(printf '%s' "$DATABASE_URL" | sed 's/localhost/db/g')
  export DATABASE_URL
fi

if [ -n "$REDIS_URL" ]; then
  REDIS_URL=$(printf '%s' "$REDIS_URL" | sed 's/localhost/redis/g')
  export REDIS_URL
fi

if ! npx prisma migrate deploy; then
  echo "Existing database schema detected; baselining migrations..."
  for migration_dir in prisma/migrations/*; do
    [ -d "$migration_dir" ] || continue
    migration_name=$(basename "$migration_dir")
    npx prisma migrate resolve --applied "$migration_name" >/dev/null 2>&1 || true
  done
  npx prisma migrate deploy || exit 1
fi

echo "Starting Next.js application..."
exec "$@"
