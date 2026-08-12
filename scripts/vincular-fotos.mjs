/**
 * Vincula las fotos ya subidas a uploads/participantes/<slug>/ con cada
 * cafetería: portada.webp queda como imagen de tarjeta y todas las fotos
 * forman la galería (la primera es la que se muestra grande en la ficha).
 *
 *   node scripts/vincular-fotos.mjs "<MONGODB_URI>" [--aplicar]
 */
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const uri = process.argv[2];
const aplicar = process.argv.includes("--aplicar");
if (!uri) {
  console.error('Uso: node scripts/vincular-fotos.mjs "<MONGODB_URI>" [--aplicar]');
  process.exit(1);
}

const RAIZ = "/var/www/html/uploads/participantes";

// La carpeta se llama por slug; aquí se dice a qué cafetería pertenece
const MAPA = {
  "cafe-unido": "unido",
  "momo-coffee-shop": "momo",
  "wknd-specialty-coffee": "wknd",
  "leto-coffee-brew-bar-roastery": "leto",
  "tosto-coffee": "tosto",
  "cabrera-coffee-brew-house": "cabrera",
  "siete-granos": "siete granos",
  "foodbarn-cafe": "foodbarn",
  "kotowa-coffee-house": "kotowa coffee house",
  "sip-studio-cafe": "sip studio",
  "sisu-coffee-studio": "sisu",
  "tono-s-cafe-bakery": "toño",
};

const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db().collection("users");
  const cafes = await col.find({ role: "cafeteria", isActive: true }).toArray();

  let ok = 0, sin = 0;
  for (const [carpeta, buscar] of Object.entries(MAPA)) {
    const dir = path.join(RAIZ, carpeta);
    if (!fs.existsSync(dir)) { console.log(`✗ sin carpeta: ${carpeta}`); sin++; continue; }

    const fotos = fs.readdirSync(dir).filter((f) => f.endsWith(".webp")).sort((a, b) => {
      // portada primero, luego foto-01, foto-02...
      if (a.startsWith("portada")) return -1;
      if (b.startsWith("portada")) return 1;
      return a.localeCompare(b);
    });
    if (!fotos.length) { console.log(`✗ carpeta vacía: ${carpeta}`); sin++; continue; }

    const urls = fotos.map((f) => `/api/uploads/participantes/${carpeta}/${f}`);
    const cafe = cafes.find((c) => norm(c.cafeteriaName || c.name).includes(norm(buscar)));
    if (!cafe) { console.log(`✗ sin cafetería para "${buscar}"`); sin++; continue; }

    console.log(`✓ ${(cafe.cafeteriaName || cafe.name).padEnd(48)} ${fotos.length} fotos`);
    if (aplicar) {
      await col.updateOne(
        { _id: cafe._id },
        { $set: { coverImage: urls[0], gallery: urls, updatedAt: new Date() } }
      );
    }
    ok++;
  }

  console.log(`\n${aplicar ? "APLICADO" : "SIMULACRO"} — vinculadas: ${ok} · sin resolver: ${sin}`);
  if (!aplicar) console.log("Volver a ejecutar con --aplicar para escribir en la base.");
} finally {
  await client.close();
}
