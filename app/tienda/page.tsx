import { Suspense } from "react";
import { getStoreProducts } from "@/app/actions/storeProduct";
import TiendaClient from "./TiendaClient";
import Footer from "@/app/components/layout/Footer";

export const metadata = {
  title: "Tienda | Coffee Geeks Panamá",
  description: "Accesorios, granos especiales y mercancía oficial para los apasionados del café en Panamá.",
};

export const dynamic = "force-dynamic";

export default async function TiendaPage() {
  const products = await getStoreProducts(true); // Fetch active products

  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f4efe4] text-[#38050e] font-sans">Cargando catálogo...</div>}>
        <TiendaClient initialProducts={products} />
      </Suspense>
      <Footer />
    </>
  );
}
