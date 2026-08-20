import { notFound } from "next/navigation";
import { getFincaBySlugId } from "@/app/actions/finca";
import FincaDetailClient from "./FincaDetailClient";
import Footer from "@/app/components/layout/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const finca = await getFincaBySlugId(id);
  if (!finca) return { title: "Finca no encontrada | Coffee Geeks Panamá" };

  return {
    title: `${finca.name} | Fincas · Coffee Geeks Panamá`,
    description:
      finca.shortDescription ||
      `Conoce ${finca.name} en ${finca.location || finca.region}, su terroir, su café y sus experiencias.`,
  };
}

export default async function FincaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const finca = await getFincaBySlugId(id);

  if (!finca || !finca.isActive) return notFound();

  const gallery: string[] = [
    ...(finca.coverImage ? [finca.coverImage] : []),
    ...(Array.isArray(finca.gallery) ? finca.gallery : []),
  ].filter(Boolean);

  const data = {
    id: finca._id,
    name: finca.name,
    producer: finca.producer || "",
    region: finca.region || "",
    location: finca.location || finca.region || "Panamá",
    altitude: finca.altitude || 0,
    varieties: Array.isArray(finca.varieties) ? finca.varieties : [],
    processes: Array.isArray(finca.processes) ? finca.processes : [],
    shortDescription: finca.shortDescription || "",
    description: finca.description || "",
    story: finca.story || "",
    terroir: finca.terroir || "",
    coffeeProfile: finca.coffeeProfile || "",
    website: finca.website || "",
    instagram: finca.instagram || "",
    whatsapp: finca.whatsapp || "",
    // Puede quedar vacío (finca aún sin foto): la ficha muestra el hero en
    // fondo vino y oculta el carrusel. No usar stock genérico.
    gallery,
    experiences: (finca.experiences || [])
      .filter((e: any) => e.isActive)
      .sort((a: any, b: any) => a.order - b.order)
      .map((e: any) => ({
        id: e._id,
        title: e.title,
        summary: e.summary || "",
        description: e.description || "",
        duration: e.duration || "",
        capacity: e.capacity || 0,
        price: e.price || 0,
        currency: e.currency || "USD",
        includes: Array.isArray(e.includes) ? e.includes : [],
        languages: Array.isArray(e.languages) ? e.languages : [],
        img: e.image || finca.coverImage || gallery[0] || "",
      })),
  };

  return (
    <>
      <FincaDetailClient finca={data} />
      <Footer />
    </>
  );
}
