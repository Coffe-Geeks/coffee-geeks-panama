import { Suspense } from "react";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Vote from "@/models/Vote";
import SiteConfig from "@/models/SiteConfig";
import ParticipantesClient from "./ParticipantesClient";
import Footer from "@/app/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function ParticipantesPage() {
  await dbConnect();
  
  const config = await SiteConfig.findOne();
  const currentRound = config?.currentVotingRound || 0;
  
  const query: any = { role: "cafeteria", isActive: true };
  if (currentRound === 2) {
    query.advancedToRound2 = true;
  }
  const cafeterias = await User.find(query).lean();
  
  let votesCountMap: Record<string, number> = {};
  if (currentRound > 0) {
    const votes = await Vote.find({ round: currentRound }).lean();
    votes.forEach((v: any) => {
      const cid = v.cafeteriaId.toString();
      votesCountMap[cid] = (votesCountMap[cid] || 0) + 1;
    });
  }

  // Los coffee shops con foto de su barista van primero; los que no tienen
  // ninguna foto de barista se acomodan de últimos. La foto puede venir de la
  // portada editorial (convención portada-barista-*) o de la foto propia que
  // el barista destacado subió en su ficha.
  const tieneFotoBarista = (c: any) => {
    const destacado = Array.isArray(c.baristas)
      ? (c.baristas.find((b: any) => b.isHighlighted) || c.baristas[0])
      : null;
    const fotoPropia = !!(destacado && destacado.photo);
    const portada = /(?:portada-)?barista/i.test(c.coverImage || "");
    return fotoPropia || portada;
  };

  const completitud = (c: any) => {
    const conFoto = !!c.coverImage;
    const conFicha = !!(c.tagline || c.espresso || c.filtrado || c.signatureDrink);
    const galeria = Array.isArray(c.gallery) ? c.gallery.length : 0;
    return (conFoto && conFicha ? 100 : 0) + (conFoto ? 20 : 0) + (conFicha ? 15 : 0) + Math.min(galeria, 10);
  };

  cafeterias.sort((a: any, b: any) => {
    const baristasPrimero = Number(tieneFotoBarista(b)) - Number(tieneFotoBarista(a));
    if (baristasPrimero !== 0) return baristasPrimero;

    const d = completitud(b) - completitud(a);
    if (d !== 0) return d;
    return (a.cafeteriaName || a.name || "").localeCompare(b.cafeteriaName || b.name || "");
  });

  const SHOPS = cafeterias.map((c: any) => ({
    id: c._id.toString(),
    type: c.businessType || "coffee",
    name: c.cafeteriaName || `${c.name} ${c.lastName}`.trim(),
    cat: Array.isArray(c.competitionCategory) && c.competitionCategory.length > 0
      ? c.competitionCategory.join(" - ")
      : (typeof c.competitionCategory === 'string' && c.competitionCategory ? c.competitionCategory : "Cafetería"),
    loc: c.neighborhood || "Panamá",
    votes: votesCountMap[c._id.toString()] || 0,
    img: c.coverImage || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=75",
  }));

  return (
    <>
      <Suspense fallback={<div>Cargando...</div>}>
        <ParticipantesClient initialShops={SHOPS} />
      </Suspense>
      <Footer />
    </>
  );
}
