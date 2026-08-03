#!/usr/bin/env bash
# Siembra una MongoDB remota (Atlas u otra) con el respaldo de producción.
#   Uso: ./scripts/db-seed-remote.sh "mongodb+srv://user:pass@cluster.mongodb.net/coffee_geeks" ruta/al/backup.archive.gz
set -euo pipefail

URI="${1:?Falta el connection string}"
ARCHIVE="${2:?Falta la ruta del archivo .archive.gz}"
[ -f "$ARCHIVE" ] || { echo "No existe: $ARCHIVE"; exit 1; }

echo "▲ Restaurando en el cluster remoto (--drop)..."
# Usa el mongorestore del contenedor para no depender de las database-tools locales.
docker run --rm -i mongo:8 mongorestore \
  --uri="$URI" --archive --gzip --drop --nsInclude='coffee_geeks.*' < "$ARCHIVE"

echo "✓ Seed completado."
