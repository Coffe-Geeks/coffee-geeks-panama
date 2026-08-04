import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * El entorno de pruebas (*.vercel.app) se cierra por completo a los
 * buscadores; el sitio real, que corre el mismo código en el droplet,
 * se mantiene abierto.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  // Detrás del proxy de Vercel el host original llega en x-forwarded-host
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const isPreview = host.endsWith(".vercel.app");

  if (isPreview) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Zonas privadas o sin valor de búsqueda
      disallow: ["/admin/", "/perfil", "/api/", "/datos-personales"],
    },
  };
}
