import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getSiteConfig } from "@/lib/siteConfig";

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

  return {
    title,
    description,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
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
