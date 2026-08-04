import { Suspense } from "react";
import { getFincas } from "@/app/actions/finca";
import FincasClient from "./FincasClient";
import Footer from "@/app/components/layout/Footer";

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
    img:
      f.coverImage ||
      "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=800&q=75",
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
