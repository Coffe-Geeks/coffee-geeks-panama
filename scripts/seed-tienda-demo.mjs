/**
 * Siembra dos productos de DEMOSTRACIÓN para recorrer el flujo de compra.
 *
 * Uno físico con tallas y existencias limitadas, y uno digital sin envío:
 * entre los dos ejercitan las dos ramas del checkout (con dirección y sin
 * ella). Se pueden borrar desde /admin/productos cuando ya no hagan falta.
 *
 *   node scripts/seed-tienda-demo.mjs "<MONGODB_URI>"           (simulación)
 *   node scripts/seed-tienda-demo.mjs "<MONGODB_URI>" --aplicar (escribe)
 */
import { MongoClient, ObjectId } from "mongodb";

const uri = process.argv[2];
const aplicar = process.argv.includes("--aplicar");

if (!uri) {
  console.error('Uso: node scripts/seed-tienda-demo.mjs "<MONGODB_URI>" [--aplicar]');
  process.exit(1);
}

const ahora = new Date();

const productos = [
  {
    name: "Camiseta Coffee Geeks",
    price: 25,
    sku: "DEMO-CAMISA",
    stock: -1,
    variants: [
      { _id: new ObjectId(), label: "S", sku: "DEMO-CAMISA-S", stock: 6 },
      { _id: new ObjectId(), label: "M", sku: "DEMO-CAMISA-M", stock: 4 },
      { _id: new ObjectId(), label: "L", sku: "DEMO-CAMISA-L", stock: 0 },
    ],
    requiresShipping: true,
    shortDescription: "Algodón orgánico, serigrafía a un color. PRODUCTO DE DEMOSTRACIÓN.",
    description:
      "<p>Producto sembrado para probar el flujo de compra. La talla L viene sin existencias a propósito, para ver cómo se comporta el selector.</p>",
    image: "",
    webhook: "",
    isActive: true,
    createdAt: ahora,
    updatedAt: ahora,
  },
  {
    name: "Pasaporte Digital",
    price: 10,
    sku: "DEMO-PASAPORTE",
    // Lo digital no se agota
    stock: -1,
    variants: [],
    requiresShipping: false,
    shortDescription: "Acceso a la ruta del café panameño. PRODUCTO DE DEMOSTRACIÓN.",
    description:
      "<p>Producto sembrado para probar la compra sin envío: el checkout no pide dirección y no cobra flete.</p>",
    image: "",
    webhook: "",
    isActive: true,
    createdAt: ahora,
    updatedAt: ahora,
  },
];

const client = new MongoClient(uri);

try {
  await client.connect();
  const col = client.db().collection("storeproducts");

  for (const p of productos) {
    const existente = await col.findOne({ sku: p.sku });
    if (existente) {
      console.log(`= ya existe: ${p.name} (${p.sku})`);
      continue;
    }
    if (aplicar) {
      await col.insertOne(p);
      console.log(`+ creado: ${p.name} — $${p.price}`);
    } else {
      console.log(`+ se crearía: ${p.name} — $${p.price}`);
    }
  }

  const total = await col.countDocuments();
  console.log(`\nProductos en la tienda: ${total}`);
  if (!aplicar) console.log("Simulación. Agrega --aplicar para escribir.");
} finally {
  await client.close();
}
