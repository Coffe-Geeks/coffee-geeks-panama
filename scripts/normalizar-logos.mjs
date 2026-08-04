/**
 * Recorta el margen vacío de los logos de aliados ya subidos.
 *
 * Los archivos de marca suelen venir en lienzos con mucho aire alrededor,
 * y en proporciones muy distintas entre sí; dentro de una caja de altura
 * fija eso los hace verse de tamaños dispares. Esto los deja a todos
 * empezando desde el mismo sitio. Las subidas nuevas ya se recortan solas
 * en lib/upload.ts.
 *
 *   node scripts/normalizar-logos.mjs "<MONGODB_URI>" "<BLOB_TOKEN>"
 */
import { MongoClient } from "mongodb";
import { put, del } from "@vercel/blob";
import sharp from "sharp";

const [uri, token] = process.argv.slice(2);
if (!uri || !token) {
  console.error('Uso: node scripts/normalizar-logos.mjs "<MONGODB_URI>" "<BLOB_TOKEN>"');
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db().collection("allies");
  const allies = await col.find({ logo: { $ne: "" } }).toArray();

  for (const ally of allies) {
    if (!ally.logo.startsWith("http")) {
      console.log(`— ${ally.name}: en disco, se omite`);
      continue;
    }

    const res = await fetch(ally.logo);
    if (!res.ok) {
      console.log(`✗ ${ally.name}: no se pudo descargar (${res.status})`);
      continue;
    }

    const original = Buffer.from(await res.arrayBuffer());
    const before = await sharp(original).metadata();
    const trimmed = await sharp(original).trim({ threshold: 12 }).png().toBuffer();
    const after = await sharp(trimmed).metadata();

    const areaBefore = before.width * before.height;
    const areaAfter = after.width * after.height;
    const saved = Math.round((1 - areaAfter / areaBefore) * 100);

    if (saved < 2) {
      console.log(`— ${ally.name}: ya venía ajustado, sin cambios`);
      continue;
    }

    const key = `aliados/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
    const { url } = await put(key, trimmed, {
      access: "public",
      addRandomSuffix: false,
      token,
    });

    await col.updateOne({ _id: ally._id }, { $set: { logo: url, updatedAt: new Date() } });
    await del(ally.logo, { token }).catch(() => {});

    console.log(
      `✓ ${ally.name}: ${before.width}x${before.height} → ${after.width}x${after.height} (−${saved}% de margen)`
    );
  }
} finally {
  await client.close();
}
