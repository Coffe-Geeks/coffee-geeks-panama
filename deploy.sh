#!/usr/bin/env bash
#
# Despliegue a producción de coffeegeekspanama.com
#
#   ./deploy.sh
#
# Trae siempre lo último de GitHub antes de publicar, de modo que nunca
# se despliega una copia vieja del proyecto.
#
# Requisito, una sola vez por computadora:
#   npx vercel@latest login      (con la cuenta de Muce)
#   npx vercel@latest link       (elegir el equipo Muce Studios y el
#                                 proyecto coffee-geeks-oficial)
#
set -euo pipefail

cd "$(dirname "$0")"

# 1) Estar en main y con el árbol limpio, para no publicar algo a medias.
rama="$(git rev-parse --abbrev-ref HEAD)"
if [ "$rama" != "main" ]; then
  echo "→ Estás en la rama '$rama'; cambiando a main…"
  git checkout main
fi
if [ -n "$(git status --porcelain)" ]; then
  echo "⛔ Tienes cambios sin guardar. Haz commit (o guárdalos) antes de desplegar."
  exit 1
fi

# 2) Traer lo último de GitHub: así tu copia local queda igual que la de
#    los demás antes de publicar.
echo "→ Trayendo lo último de GitHub…"
git pull --ff-only origin main

# 3) Publicar en producción con tu sesión de Vercel.
echo "→ Desplegando a producción…"
npx vercel@latest deploy --prod --yes

echo "✓ Listo. Revisa https://coffeegeekspanama.com"
