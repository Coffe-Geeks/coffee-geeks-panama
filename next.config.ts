import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      // Archivos subidos desde el entorno de pruebas, que van a Vercel Blob
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    return [
      {
        // El home dejó de vivir en /home: ahora ES la portada. Redirección
        // permanente para los enlaces ya compartidos y lo indexado.
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        // La sección se llamaba /fincas. Redirección permanente para que
        // los enlaces ya compartidos y lo indexado sigan funcionando.
        source: "/fincas",
        destination: "/guia-de-experiencias",
        permanent: true,
      },
      {
        source: "/fincas/:path*",
        destination: "/guia-de-experiencias/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Todo lo servido desde *.vercel.app es el entorno de pruebas:
        // se marca como no indexable para que no compita en buscadores
        // con el sitio real. El droplet corre este mismo código pero
        // con otro host, así que allí la cabecera no se aplica.
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;
