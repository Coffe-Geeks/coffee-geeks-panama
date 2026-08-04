import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
