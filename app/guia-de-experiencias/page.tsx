import { Suspense } from "react";
import { getFincas } from "@/app/actions/finca";
import FincasClient from "./FincasClient";
import Footer from "@/app/components/layout/Footer";

export const metadata = {
  title: "The Origin Guide By Panama Unique § Coffee Geeks",
  description:
    "Una guía curada de fincas, coffee shops, rutas cafeteras y experiencias auténticas del café de Panamá.",
};

export const dynamic = "force-dynamic";

export default async function FincasPage() {
  const fincas = await getFincas();

  const FINCAS = fincas.map((f: any) => ({
    id: f._id,
    name: f.name,
    producer: f.producer || "",
    region: f.region || "Boquete",
    loc: f.location || f.region || "Panamá",
    altitude: f.altitude || 0,
    varieties: Array.isArray(f.varieties) ? f.varieties : [],
    processes: Array.isArray(f.processes) ? f.processes : [],
    desc: f.shortDescription || "",
    // Sin foto propia = cadena vacía a propósito: la tarjeta pinta una lámina
    // tipográfica. No usar stock genérico. Las fincas sin foto se resuelven
    // con la clienta.
    img: f.coverImage || "",
    experiences: (f.experiences || []).filter((e: any) => e.isActive).length,
  }));

  return (
    <>
      <Suspense fallback={<div>Cargando...</div>}>
        <FincasClient initialFincas={FINCAS} />
      </Suspense>
      <Footer />
    </>
  );
}
