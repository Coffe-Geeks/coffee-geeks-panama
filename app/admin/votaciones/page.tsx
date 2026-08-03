import { getLeaderboard } from "@/app/actions/voting";
import SiteConfig from "@/models/SiteConfig";
import dbConnect from "@/lib/mongodb";
import AdminVotacionesClient from "./AdminVotacionesClient";

export const dynamic = "force-dynamic";

export default async function AdminVotacionesPage() {
  await dbConnect();
  const config = await SiteConfig.findOne();
  const currentRound = config?.currentVotingRound || 0;

  const leaderboard = await getLeaderboard();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-[#38050e] backdrop-blur-md p-6 rounded-2xl border border-[#cddbf2]/10">
        <div>
          <h1 className="text-3xl font-black text-[#cddbf2] tracking-wide mb-2">Panel de Votaciones</h1>
          <p className="text-[#cddbf2]/60 font-medium">Gestiona el flujo del evento y revisa los resultados en tiempo real.</p>
        </div>
      </div>

      <AdminVotacionesClient currentRound={currentRound} initialLeaderboard={leaderboard} />
    </div>
  );
}
