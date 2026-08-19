import { Suspense } from "react";
import { getExperiences } from "@/app/actions/finca";
import ExperienciasClient from "./ExperienciasClient";
import Footer from "@/app/components/layout/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Del Origen a la Barra | Coffee Geeks Panamá",
  description:
    "Vive el café panameño desde la finca: recorridos, cataciones y experiencias que ofrecen las fincas participantes de Coffee Geeks Panamá.",
  // Página retirada del sitio mientras las experiencias se gestionan en
  // Panama Unique: sin enlaces y sin indexar, pero la ruta sigue viva
  // para poder reactivarla sin rehacer nada.
  robots: { index: false, follow: false },
};

export default async function ExperienciasPage() {
  const experiences = await getExperiences();

  const EXPERIENCES = experiences.map((e: any) => ({
    id: e._id,
    fincaId: e.fincaId,
    finca: e.fincaName,
    region: e.fincaRegion,
    loc: e.fincaLocation || e.fincaRegion,
    title: e.title,
    summary: e.summary || "",
    duration: e.duration || "",
    capacity: e.capacity || 0,
    price: e.price || 0,
    currency: e.currency || "USD",
    includes: Array.isArray(e.includes) ? e.includes : [],
    languages: Array.isArray(e.languages) ? e.languages : [],
    img:
      e.image ||
      e.fincaCover ||
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=75",
  }));

  return (
    <>
      <Suspense fallback={<div>Cargando...</div>}>
        <ExperienciasClient initialExperiences={EXPERIENCES} />
      </Suspense>
      <Footer />
    </>
  );
}
