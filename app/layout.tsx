import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getSiteConfig } from "@/lib/siteConfig";
import RegistroGate from "@/app/components/RegistroGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata dinámica: se lee desde la DB en cada build/revalidación
export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSiteConfig();

  const title = cfg.seoTitle || "Coffee Geeks Panamá | Descubre, Vota y Recorre las Mejores lugares donde sirven café de Panamá";
  const description = cfg.seoDescription || "Explora los mejores Coffee Shop, Hoteles y Restaurantes de Panamá, participa en el concurso, vota por tu favorito y recorre la ruta de las mejores Coffee Shops con Coffee Geeks Panamá.";

  // El entorno de pruebas no debe indexarse: compite con el sitio real
  // por el mismo contenido. Va además de la cabecera X-Robots-Tag de
  // next.config, porque no todos los rastreadores leen ambas señales.
  const h = await headers();
  // Detrás del proxy de Vercel el host original llega en x-forwarded-host
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const isPreview = host.endsWith(".vercel.app");

  return {
    title,
    description,
    ...(isPreview
      ? { robots: { index: false, follow: false, nocache: true } }
      : {}),
    icons: {
      icon: "/fav.png",
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_PA",
      siteName: "Coffee Geeks Panamá",
      ...(cfg.ogImage ? { images: [{ url: cfg.ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(cfg.ogImage ? { images: [cfg.ogImage] } : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Puerta de registro: el sitio solo se ve tras dejar nombre y correo.
  // Quien ya se registró (cookie) o tiene sesión iniciada pasa directo.
  // DESHABILITADA por ahora (pedido 21-ago): poner en true para reactivarla.
  const GATE_ACTIVO = false;
  const cookieStore = await cookies();
  const yaRegistrado =
    !GATE_ACTIVO || cookieStore.has("cg_registro") || cookieStore.has("session");
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        {!yaRegistrado && <RegistroGate />}
        <Script id="matomo-tracker" strategy="afterInteractive">
          {`
            var _paq = window._paq = window._paq || [];
            /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
            _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
              var u="https://analitica.losdelpatio.com/";
              _paq.push(['setTrackerUrl', u+'matomo.php']);
              _paq.push(['setSiteId', '5']);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
          `}
        </Script>
        <noscript>
          <p>
            <img 
              referrerPolicy="no-referrer-when-downgrade" 
              src="https://analitica.losdelpatio.com/matomo.php?idsite=5&rec=1" 
              style={{ border: 0 }} 
              alt="" 
            />
          </p>
        </noscript>
      </body>
    </html>
  );
}
