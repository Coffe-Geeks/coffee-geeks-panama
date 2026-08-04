# Coffee Geeks Panamá

Plataforma del concurso Coffee Geeks Panamá: registro de cafeterías participantes,
votaciones, pasaporte, blog, academia (e-learning) y panel de administración.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind 4 ·
MongoDB + Mongoose · JWT con `jose` · Leaflet · SMTP2GO · reCAPTCHA v3

---

## Entornos

| Entorno | Rama | Dónde | Base de datos |
|---|---|---|---|
| Producción | `main` | Droplet DigitalOcean (`nginx` + `pm2`, puerto 3001, `/var/www/html`) | MongoDB local en el droplet (`127.0.0.1:27017`) |
| Testing | `test` | Vercel — `coffeegeekspanama.vercel.app` | MongoDB Atlas M0 |
| Local | `test` | Docker | `mongodb://127.0.0.1:27017/coffee_geeks` |

## Flujo de trabajo

Todo cambio se desarrolla y se despliega **primero** al entorno de pruebas. A
producción solo se sube cuando está aprobado.

```bash
# 1. Trabajar siempre sobre test
git checkout test

# 2. Desplegar al sitio de prueba y verificar ahí
vercel deploy --prod --yes     # el --prod es la producción del proyecto de
                               # Vercel, o sea el sitio de PRUEBA

# 3. Ya aprobado, promover a producción
git checkout main && git merge test && git push origin main
```

> **`/var/www/html` no es un repositorio git.** Producción se desplegó copiando
> archivos, así que subir cambios va por `rsync`/`scp`, no por `git pull`. Al
> sincronizar hay que excluir `uploads/`, que contiene las imágenes subidas por
> los usuarios y no está en el repositorio.

---

## Desarrollo local

```bash
# 1. Dependencias
npm install

# 2. Variables de entorno
cp .env.example .env.local   # y completar los valores

# 3. Base de datos en Docker + respaldo de producción
./scripts/db-restore-local.sh ~/Documents/coffee-geeks-backups/cg-backup-XXXX.archive.gz

# 4. Arrancar
npm run dev
```

## Respaldar producción

```bash
ssh -i ~/.ssh/id_ed25519 root@<IP-DROPLET>
cd /var/www/html
URI=$(grep -E '^MONGODB_URI=' .env.local | sed -E 's/^MONGODB_URI=//; s/"//g')
mongodump --uri="$URI" --archive=/root/cg-backup-$(date +%Y%m%d).archive.gz --gzip

# desde tu máquina:
scp -i ~/.ssh/id_ed25519 root@<IP-DROPLET>:/root/cg-backup-*.archive.gz ~/Documents/coffee-geeks-backups/
```

## Sembrar la BD de testing (Atlas)

```bash
./scripts/db-seed-remote.sh "mongodb+srv://user:pass@cluster.mongodb.net/coffee_geeks" \
  ~/Documents/coffee-geeks-backups/cg-backup-XXXX.archive.gz
```

---

## Variables de entorno

Ver [.env.example](.env.example). Todas son obligatorias:
`MONGODB_URI`, `JWT_SECRET`, `SMTP2GO_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`,
`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`.

---

## Archivos subidos (imágenes)

Las imágenes de cafeterías, portadas y galería se guardan en `./uploads/` (fuera de
`public/`) y se sirven vía `app/api/uploads/[...path]`. Este esquema **solo funciona en
un servidor con disco persistente** (el droplet). En Vercel el sistema de archivos es
efímero: las subidas nuevas se pierden en cada deploy. Para usar Vercel como entorno
real de subidas hay que migrar `lib/upload.ts` a almacenamiento de objetos
(Vercel Blob, S3 o Cloudinary).

---

## Estructura

```
app/            rutas (App Router) + acciones de servidor en app/actions/
app/api/        endpoints REST (sesión, cafeterías activas, uploads, política)
lib/            mongodb, session (JWT), upload, email, siteConfig
models/         esquemas Mongoose (User, Vote, BlogPost, Course, Product, ...)
middleware.ts   protección de rutas /admin/* y /perfil
scripts/        respaldo y siembra de base de datos
docker-compose.yml  MongoDB local para desarrollo
```
