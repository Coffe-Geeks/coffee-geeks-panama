/**
 * Siembra los 5 aliados con logos PLACEHOLDER, para ver el carrusel
 * funcionando. Los nombres y el orden son los reales: solo hay que
 * reemplazar cada logo desde /admin/aliados.
 *
 *   node scripts/seed-aliados.mjs "mongodb://127.0.0.1:27017/coffee_geeks"
 */
import { MongoClient } from "mongodb";

const uri = process.argv[2];
if (!uri) {
  console.error('Uso: node scripts/seed-aliados.mjs "<MONGODB_URI>"');
  process.exit(1);
}

const now = new Date();

const allies = [
  { name: "Copa Airlines", logo: "/api/uploads/aliados/ph-copa.png", order: 1 },
  { name: "The Best Coffee Shops Panamá", logo: "/api/uploads/aliados/ph-thebest.png", order: 2 },
  { name: "Fundación Marca País", logo: "/api/uploads/aliados/ph-marcapais.png", order: 3 },
  { name: "BEC Experience Center", logo: "/api/uploads/aliados/ph-bec.png", order: 4 },
  // El logo de Sanremo viene en blanco: se invierte para que exista sobre fondo claro
  { name: "Sanremo Coffee Machines", logo: "/api/uploads/aliados/ph-sanremo.png", order: 5, isLightLogo: true },
];

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db().collection("allies");

  // Solo borra los sembrados de ejemplo, nunca los que se hayan cargado a mano
  await col.deleteMany({ logo: /\/ph-[a-z]+\.png$/ });

  const docs = allies.map((a) => ({
    url: "",
    isLightLogo: false,
    isActive: true,
    ...a,
    createdAt: now,
    updatedAt: now,
  }));

  const res = await col.insertMany(docs);
  console.log(`✓ ${res.insertedCount} aliados sembrados (logos placeholder).`);
} finally {
  await client.close();
}
