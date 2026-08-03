import { getActiveCafeteriasForVoting } from "@/app/actions/voting";
import VotacionesClient from "./VotacionesClient";
import Footer from "@/app/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function VotacionesPage() {
  const { round, cafeterias } = await getActiveCafeteriasForVoting();

  return (
    <>
      <VotacionesClient initialRound={round} initialCafeterias={cafeterias} />
      <Footer />
    </>
  );
}
