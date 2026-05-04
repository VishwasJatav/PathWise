#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma db push --accept-data-loss --skip-generate

echo "Starting Next.js application..."
exec "$@"
