import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import BlogPost from "@/models/BlogPost";
import Finca from "@/models/Finca";
import StoreProduct from "@/models/StoreProduct";
import Course from "@/models/Course";

export const dynamic = "force-dynamic";

/**
 * Páginas fijas que vale la pena indexar, con la prioridad relativa que
 * tienen para el proyecto. Quedan fuera a propósito las de cuenta y compra
 * —login, registro, carrito, checkout, pedido, perfil—: no aportan a la
 * búsqueda y varias exigen sesión. `robots.ts` ya cierra /admin, /api,
 * /perfil y /datos-personales.
 */
const FIJAS: [string, number, MetadataRoute.Sitemap[0]["changeFrequency"]][] = [
  ["", 1.0, "daily"],
  ["/participantes", 0.9, "daily"],
  ["/votaciones", 0.9, "daily"],
  ["/tienda", 0.9, "weekly"],
  ["/el-concurso/guia-del-consumidor", 0.8, "monthly"],
  ["/el-concurso/terminos", 0.6, "monthly"],
  ["/academia", 0.8, "weekly"],
  ["/guia-de-experiencias", 0.8, "weekly"],
  ["/guia-de-experiencias/experienciasdelorigenalabarra", 0.7, "monthly"],
  ["/blogs", 0.7, "weekly"],
  ["/sobre-nosotros", 0.6, "monthly"],
  ["/nuestro-metodo", 0.6, "monthly"],
  ["/aplicar", 0.6, "monthly"],
  ["/pasaporte", 0.8, "weekly"],
  ["/guia-participante", 0.5, "monthly"],
  ["/guia-consumidor", 0.5, "monthly"],
  ["/terminos", 0.3, "yearly"],
  ["/privacidad", 0.3, "yearly"],
  ["/politica-de-compras", 0.3, "yearly"],
  ["/politica-de-cancelaciones", 0.3, "yearly"],
];

/**
 * Mapa del sitio para los buscadores.
 *
 * El dominio se toma de la petición y no de una constante, igual que en
 * `robots.ts`: así el archivo sirve en cualquier despliegue sin editarlo. El
 * entorno de pruebas igual queda fuera del índice, porque `robots.ts` lo
 * cierra por completo.
 *
 * Todo el sitio está en español, así que no se declaran alternativas de
 * idioma: un `hreflang` apuntando a páginas que no existen manda a Google a
 * URLs rotas y perjudica el posicionamiento en vez de ayudarlo.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "coffeegeekspanama.com";
  const proto = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  const base = `${proto}://${host}`;

  const ahora = new Date();
  const rutas: MetadataRoute.Sitemap = FIJAS.map(([ruta, priority, changeFrequency]) => ({
    url: `${base}${ruta}`,
    lastModified: ahora,
    changeFrequency,
    priority,
  }));

  /**
   * El contenido de la base se agrega en un solo intento. Si la base no
   * responde, el mapa sale igual con las páginas fijas: un sitemap incompleto
   * es mucho mejor que un 500, que Google interpreta como sitemap inválido.
   */
  try {
    await dbConnect();

    const [cafeterias, entradas, fincas, productos, cursos] = await Promise.all([
      User.find({ role: "cafeteria", isActive: true }).select("_id updatedAt").lean(),
      BlogPost.find({ isPublished: true }).select("slug updatedAt").lean(),
      Finca.find({ isActive: true }).select("_id updatedAt").lean(),
      StoreProduct.find({ isActive: true }).select("_id updatedAt").lean(),
      Course.find({ isActive: true }).select("_id updatedAt").lean(),
    ]);

    const agregar = (
      items: any[],
      prefijo: string,
      clave: "slug" | "_id",
      priority: number,
      changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]
    ) => {
      for (const it of items) {
        const id = clave === "slug" ? it.slug : it._id?.toString();
        if (!id) continue;
        rutas.push({
          url: `${base}${prefijo}/${id}`,
          lastModified: it.updatedAt ? new Date(it.updatedAt) : ahora,
          changeFrequency,
          priority,
        });
      }
    };

    agregar(cafeterias, "/participantes", "_id", 0.8, "weekly");
    agregar(entradas, "/blog", "slug", 0.6, "monthly");
    agregar(fincas, "/guia-de-experiencias", "_id", 0.7, "monthly");
    agregar(productos, "/tienda", "_id", 0.8, "weekly");
    agregar(cursos, "/academia", "_id", 0.6, "monthly");
  } catch (err) {
    console.error("Sitemap: no se pudo leer el contenido de la base:", err);
  }

  return rutas;
}
