import type { Metadata } from "next";
import CoffeeBeansHero from "@/app/components/CoffeeBeansHero";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import StepsSection from "@/app/components/home/StepsSection";
import ShopsSection from "@/app/components/home/ShopsSection";
import RankingSection from "@/app/components/home/RankingSection";
import AcademiaSection from "@/app/components/home/AcademiaSection";
import BlogSection from "@/app/components/home/BlogSection";
import MapSection from "@/app/components/home/MapSection";
import AlliesSection from "@/app/components/home/AlliesSection";
import { getAllies } from "@/app/actions/ally";
import { getFincas } from "@/app/actions/finca";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const title = config.seoTitle || "Coffee Geeks Panamá | El Camino a la Gran Taza";
  const description = config.seoDescription || "Primer concurso que premia la mejor taza de café de Panamá.";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: config.ogImage ? [{ url: config.ogImage }] : [],
    },
  };
}

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Vote from "@/models/Vote";
import { getSiteConfig } from "@/lib/siteConfig";
import { ordenarCafeterias } from "@/lib/ordenCafeterias";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const config = await getSiteConfig();
  const ALLIES = await getAllies();
  const FINCAS_COUNT = (await getFincas()).length;
  const currentRound = config?.currentVotingRound || 0;

  const query: any = { role: "cafeteria", isActive: true };
  if (currentRound === 2) {
    query.advancedToRound2 = true;
  }
  const cafeterias = await User.find(query).lean();
  // Mismo orden que /participantes: primero los cofis con foto de barista.
  ordenarCafeterias(cafeterias);

  let totalVotos = 0;
  let votesCountMap: Record<string, number> = {};
  if (currentRound > 0) {
    const votes = await Vote.find({ round: currentRound }).lean();
    totalVotos = votes.length;
    votes.forEach((v: any) => {
      const cid = v.cafeteriaId.toString();
      votesCountMap[cid] = (votesCountMap[cid] || 0) + 1;
    });
  }

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
    lat: c.locationLat,
    lng: c.locationLng
  }));

  // Fotos para el fondo del hero: portada + galería de cada cafetería, para
  // que se mezclen baristas, locales y bebidas (solo fotos reales del Blob,
  // fuera el placeholder de Unsplash). El barajado lo hace el propio hero.
  const FOTOS_HERO = [
    ...new Set(
      cafeterias
        .flatMap((c: any) => [c.coverImage, ...(Array.isArray(c.gallery) ? c.gallery : [])])
        .filter((u: any) => typeof u === "string" && u.includes("blob.vercel-storage.com"))
    ),
  ] as string[];

  const sortedByVotes = [...SHOPS].sort((a, b) => b.votes - a.votes);

  const podiumRaw = [
    sortedByVotes[1], // 2nd
    sortedByVotes[0], // 1st
    sortedByVotes[2], // 3rd
  ].filter(Boolean);

  const PODIUM_DATA = podiumRaw.map((c, idx) => {
    // Determine visual position based on the index in podiumRaw [2nd, 1st, 3rd]
    let pos = 2;
    let rankCls = "rs";
    let posLabel = "2";
    let isGold = false;

    if (c.id === sortedByVotes[0]?.id) {
       pos = 1; rankCls = "rg"; posLabel = "1"; isGold = true;
    } else if (c.id === sortedByVotes[2]?.id) {
       pos = 3; rankCls = "rb2"; posLabel = "3";
    }

    return {
      pos,
      rankCls,
      posLabel,
      name: c.name,
      cat: c.cat,
      votes: `${c.votes} votos`,
      isGold,
      img: c.img
    };
  });

  const REST_DATA = sortedByVotes.slice(3, 7).map((c, idx) => ({
    pos: idx + 4,
    name: c.name,
    cat: c.cat,
    votes: c.votes
  }));

  return (
    <>
      {/* Sticky top navigation */}
      <Navbar />

      {/* Push content below the fixed navbar */}
      <main style={{ paddingTop: 58 }}>
        {/* 1. Hero animado con granos de café */}
        <CoffeeBeansHero
          config={config}
          stats={{ cafeterias: SHOPS.length, votos: totalVotos, fincas: FINCAS_COUNT }}
          fotos={FOTOS_HERO}
        />

        {/* 2. Pasos — cómo participar */}
        <StepsSection />

        {/* 3. Cafeterías participantes */}
        <ShopsSection initialShops={SHOPS} />

        {/* 3.5 Mapa de la ruta */}
        <MapSection shops={SHOPS} />

        {/* 3.6 Aliados */}
        <AlliesSection allies={ALLIES} />

        {/* 4. Ranking en vivo */}
        <RankingSection 
          podium={PODIUM_DATA} 
          rest={REST_DATA} 
          votingEndDate={config?.votingEndDate} 
        />

        {/* 5. Academia CGP */}
        <AcademiaSection />

        {/* 6. Blog — historias */}
        <BlogSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
