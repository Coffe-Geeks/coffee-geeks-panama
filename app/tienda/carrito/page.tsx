import { getSiteConfig } from "@/lib/siteConfig";
import CarritoClient from "./CarritoClient";
import Footer from "@/app/components/layout/Footer";

export const metadata = {
  title: "Tu carrito | Tienda · Coffee Geeks Panamá",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CarritoPage() {
  const cfg = await getSiteConfig();

  return (
    <>
      <CarritoClient
        configEnvio={{
          costoEnvio: Number((cfg as any).costoEnvio ?? 0),
          envioGratisDesde: Number((cfg as any).envioGratisDesde ?? 0),
        }}
      />
      <Footer />
    </>
  );
}
