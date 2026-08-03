#!/usr/bin/env bash
# Restaura un respaldo de producción en la MongoDB local de Docker.
#   Uso: ./scripts/db-restore-local.sh ~/Documents/coffee-geeks-backups/cg-backup-XXXX.archive.gz
set -euo pipefail

ARCHIVE="${1:?Falta la ruta del archivo .archive.gz}"
[ -f "$ARCHIVE" ] || { echo "No existe: $ARCHIVE"; exit 1; }

echo "▲ Levantando MongoDB en Docker..."
docker compose up -d mongo

echo "▲ Esperando a que la BD esté lista..."
until docker exec coffee-geeks-mongo mongosh --quiet --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  sleep 2
done

echo "▲ Restaurando $ARCHIVE en coffee_geeks (--drop)..."
docker exec -i coffee-geeks-mongo mongorestore --archive --gzip --drop --nsInclude='coffee_geeks.*' < "$ARCHIVE"

echo "✓ Listo. MONGODB_URI=\"mongodb://127.0.0.1:27017/coffee_geeks\""
