import { Suspense } from "react";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Vote from "@/models/Vote";
import SiteConfig from "@/models/SiteConfig";
import ParticipantesClient from "./ParticipantesClient";
import { ordenarCafeterias } from "@/lib/ordenCafeterias";
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

  // Mismo orden que la home (lib/ordenCafeterias): primero los cofis con
  // foto de barista, los que no tienen ninguna van de últimos.
  ordenarCafeterias(cafeterias);

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
