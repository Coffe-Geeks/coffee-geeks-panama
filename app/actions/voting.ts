"use server";

import dbConnect from "@/lib/mongodb";
import Vote from "@/models/Vote";
import User from "@/models/User";
import SiteConfig from "@/models/SiteConfig";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// ==========================================
// PUBLIC & VOTER ACTIONS
// ==========================================

export async function submitVote(
  cafeteriaId: string,
  baristaId: string,
  scores: { scoreExperience: number; scorePresence: number; scoreCup: number }
) {
  console.log("== DEBUG submitVote ==");
  console.log("cafeteriaId:", cafeteriaId);
  console.log("baristaId:", baristaId);
  console.log("scores:", scores);
  
  if (!cafeteriaId) {
    return { error: "El ID de la cafetería no fue recibido correctamente por el servidor." };
  }

  try {
    const session = await getSession();
    if (!session) return { error: "Debes iniciar sesión para votar." };

    await dbConnect();

    // 1. Verificar la ronda activa
    const config = await SiteConfig.findOne();
    const currentRound = config?.currentVotingRound || 0;

    if (currentRound === 0) {
      return { error: "Las votaciones están cerradas en este momento." };
    }

    // 2. Reglas de roles por ronda
    const role = session.role;
    if (role === "cafeteria") {
      return { error: "Tu usuario no está habilitado para emitir votos." };
    }
    if (currentRound === 1 && role === "user") {
      return { error: "El público general solo puede votar en la Ronda 2." };
    }
    if (currentRound === 1 && role === "juez_internacional") {
      return { error: "Los jueces internacionales votan a partir de la Ronda 2." };
    }

    // 3. Verificar que la cafetería exista y si es Ronda 2, que haya avanzado
    const cafeteria = await User.findById(cafeteriaId).lean();
    if (!cafeteria || cafeteria.role !== "cafeteria") {
      return { error: "Cafetería no encontrada." };
    }
    if (currentRound === 2 && !cafeteria.advancedToRound2) {
      return { error: "Esta cafetería no avanzó a la Ronda 2, no se admiten votos." };
    }

    // 4. Verificar que no haya votado por esta cafetería en esta ronda
    const existingVote = await Vote.findOne({
      voterId: session.userId,
      cafeteriaId,
      round: currentRound,
    });

    if (existingVote) {
      return { error: "Ya emitiste un voto por esta cafetería en esta ronda." };
    }

    // 4. Guardar voto
    await Vote.create({
      voterId: session.userId,
      voterRole: role,
      cafeteriaId,
      baristaId,
      round: currentRound,
      scoreExperience: scores.scoreExperience,
      scorePresence: scores.scorePresence,
      scoreCup: scores.scoreCup,
    });

    return { success: "Voto registrado exitosamente." };
  } catch (err: any) {
    console.error("submitVote error:", err);
    return { error: `Ocurrió un error al registrar el voto: ${err.message}` };
  }
}

export async function getActiveCafeteriasForVoting() {
  await dbConnect();
  const session = await getSession();
  const userRole = session?.role || "user";
  const isAuthenticated = !!session;

  const config = await SiteConfig.findOne();
  const currentRound = config?.currentVotingRound || 0;

  if (currentRound === 0) return { round: 0, userRole, isAuthenticated, cafeterias: [] };

  const leaderboard = await getLeaderboard();
  
  return { round: currentRound, userRole, isAuthenticated, cafeterias: leaderboard };
}

// ==========================================
// ADMIN ACTIONS
// ==========================================

export async function setVotingRound(round: number) {
  const session = await getSession();
  if (session?.role !== "admin") return { error: "No autorizado" };

  await dbConnect();
  await SiteConfig.findOneAndUpdate({}, { currentVotingRound: round }, { upsert: true });
  
  revalidatePath("/admin/votaciones");
  revalidatePath("/votaciones");
  return { success: `Ronda cambiada a ${round}` };
}

export async function processRound1Advancement() {
  const session = await getSession();
  if (session?.role !== "admin") return { error: "No autorizado" };

  await dbConnect();
  
  // 1. Obtener todos los votos de la Ronda 1 (solo deben ser de jueces locales)
  const votes = await Vote.find({ round: 1 }).lean();
  
  // Agrupar por cafetería
  const scoresByCafeteria: Record<string, { total: number, count: number }> = {};
  
  votes.forEach((v: any) => {
    const cid = v.cafeteriaId.toString();
    if (!scoresByCafeteria[cid]) scoresByCafeteria[cid] = { total: 0, count: 0 };
    
    // El puntaje de R1 es de 1 a 5. Podemos promediar los 3 criterios o sumarlos.
    // Asumiremos el promedio de los 3 criterios como el puntaje dado por ese juez.
    const avgScore = (v.scoreExperience + v.scorePresence + v.scoreCup) / 3;
    
    scoresByCafeteria[cid].total += avgScore;
    scoresByCafeteria[cid].count += 1;
  });

  // 2. Determinar quiénes avanzan (promedio >= 4)
  const advancedIds: string[] = [];
  
  for (const cid in scoresByCafeteria) {
    const avg = scoresByCafeteria[cid].total / scoresByCafeteria[cid].count;
    if (avg >= 4) {
      advancedIds.push(cid);
    }
  }

  // 3. Actualizar la base de datos
  // Reset everyone first
  await User.updateMany({ role: "cafeteria" }, { advancedToRound2: false });
  
  // Set true for winners
  if (advancedIds.length > 0) {
    await User.updateMany({ _id: { $in: advancedIds } }, { advancedToRound2: true });
  }

  return { success: `${advancedIds.length} cafeterías avanzaron a la Ronda 2.` };
}

export async function getLeaderboard() {
  await dbConnect();
  
  const config = await SiteConfig.findOne();
  const targetRound = config?.currentVotingRound === 1 ? 1 : 2;

  const cafeteriasQuery: any = { role: "cafeteria", isActive: true };
  if (targetRound === 2) {
    cafeteriasQuery.advancedToRound2 = true;
  }
  
  const cafeterias = await User.find(cafeteriasQuery).lean();
  const votes = await Vote.find({ round: targetRound }).lean();

  if (targetRound === 1) {
    const results = cafeterias.map((c: any) => {
      const cid = c._id.toString();
      const cVotes = votes.filter((v: any) => v.cafeteriaId.toString() === cid);
      
      let totalPoints = 0;
      cVotes.forEach((v: any) => {
        totalPoints += (v.scoreExperience + v.scorePresence + v.scoreCup) / 3;
      });
      const avg = cVotes.length > 0 ? totalPoints / cVotes.length : 0;

      return {
        id: cid,
        name: c.cafeteriaName || `${c.name} ${c.lastName}`,
        category: Array.isArray(c.competitionCategory) && c.competitionCategory.length > 0 ? c.competitionCategory.join(" - ") : (typeof c.competitionCategory === 'string' && c.competitionCategory ? c.competitionCategory : "Sin Categoría"),
        competitionCategory: Array.isArray(c.competitionCategory) && c.competitionCategory.length > 0 ? c.competitionCategory.join(" - ") : (typeof c.competitionCategory === 'string' ? c.competitionCategory : ""),
        barista: c.baristas?.find((b: any) => b.isHighlighted)?.fullName || "-",
        baristaName: c.baristas?.find((b: any) => b.isHighlighted)?.fullName || "",
        coverImage: c.coverImage,
        neighborhood: c.neighborhood,
        businessType: c.businessType,
        baristaId: c.baristas?.find((b: any) => b.isHighlighted)?._id.toString() || "",
        baristaPhoto: c.baristas?.find((b: any) => b.isHighlighted)?.photo || "",
        votesCount: cVotes.length,
        scores: {
          public: 0,
          local: avg,
          intl: 0,
          total: avg,
          cupTotal: 0
        }
      };
    });
    results.sort((a, b) => b.scores.total - a.scores.total);
    return results;
  }

  // ==========================================
  // LÓGICA RONDA 2
  // ==========================================

  // Para normalización pública: encontrar la cafetería con más votos absolutos del público
  const publicVotesCountByCafeteria: Record<string, number> = {};
  votes.forEach((v: any) => {
    if (v.voterRole === "user" || v.voterRole === "admin") {
      const cid = v.cafeteriaId.toString();
      publicVotesCountByCafeteria[cid] = (publicVotesCountByCafeteria[cid] || 0) + 1;
    }
  });
  
  let maxPublicVotes = 0;
  for (const count of Object.values(publicVotesCountByCafeteria)) {
    if (count > maxPublicVotes) maxPublicVotes = count;
  }

  // Fórmula base: 0.25P + 0.5T + 0.25E.
  // Escala R2 es de 1 a 3. Trataremos el 3 como el valor máximo.
  // Para llevar 1-3 a una escala 0-1: (score - 1) / (3 - 1) = (score - 1) / 2
  const normalizeScore = (score: number) => (score - 1) / 2;

  const calculateBaseScore = (v: any) => {
    const exp = normalizeScore(v.scoreExperience);
    const pres = normalizeScore(v.scorePresence);
    const cup = normalizeScore(v.scoreCup);
    return (pres * 0.25) + (cup * 0.50) + (exp * 0.25);
  };

  const results = cafeterias.map((c: any) => {
    const cid = c._id.toString();
    const cVotes = votes.filter((v: any) => v.cafeteriaId.toString() === cid);

    const publicVotes = cVotes.filter((v: any) => v.voterRole === "user" || v.voterRole === "admin");
    const localVotes = cVotes.filter((v: any) => v.voterRole === "juez_local");
    const intlVotes = cVotes.filter((v: any) => v.voterRole === "juez_internacional");

    const pCount = publicVotes.length;
    const publicRawScore = maxPublicVotes > 0 ? (pCount / maxPublicVotes) : 0;
    const finalPublic = publicRawScore * 0.20;

    let localTotal = 0;
    localVotes.forEach((v: any) => localTotal += calculateBaseScore(v));
    const localRawScore = localVotes.length > 0 ? (localTotal / localVotes.length) : 0;
    const finalLocal = localRawScore * 0.30;

    let intlTotal = 0;
    intlVotes.forEach((v: any) => intlTotal += calculateBaseScore(v));
    const intlRawScore = intlVotes.length > 0 ? (intlTotal / intlVotes.length) : 0;
    const finalIntl = intlRawScore * 0.50;

    const finalScore = finalPublic + finalLocal + finalIntl;

    let localCupTotal = 0;
    localVotes.forEach((v: any) => localCupTotal += normalizeScore(v.scoreCup));
    const localCupScore = localVotes.length > 0 ? (localCupTotal / localVotes.length) * 0.30 : 0;

    let intlCupTotal = 0;
    intlVotes.forEach((v: any) => intlCupTotal += normalizeScore(v.scoreCup));
    const intlCupScore = intlVotes.length > 0 ? (intlCupTotal / intlVotes.length) * 0.50 : 0;

    const finalCupScore = finalPublic + localCupScore + intlCupScore;

    return {
      id: cid,
      name: c.cafeteriaName || `${c.name} ${c.lastName}`,
      category: Array.isArray(c.competitionCategory) && c.competitionCategory.length > 0 ? c.competitionCategory.join(" - ") : (typeof c.competitionCategory === 'string' && c.competitionCategory ? c.competitionCategory : "Sin Categoría"),
      competitionCategory: Array.isArray(c.competitionCategory) && c.competitionCategory.length > 0 ? c.competitionCategory.join(" - ") : (typeof c.competitionCategory === 'string' ? c.competitionCategory : ""),
      barista: c.baristas?.find((b: any) => b.isHighlighted)?.fullName || "-",
      baristaName: c.baristas?.find((b: any) => b.isHighlighted)?.fullName || "",
      coverImage: c.coverImage,
      neighborhood: c.neighborhood,
      businessType: c.businessType,
      baristaId: c.baristas?.find((b: any) => b.isHighlighted)?._id.toString() || "",
      baristaPhoto: c.baristas?.find((b: any) => b.isHighlighted)?.photo || "",
      votesCount: cVotes.length,
      scores: {
        public: finalPublic,
        local: finalLocal,
        intl: finalIntl,
        total: finalScore,
        cupTotal: finalCupScore
      }
    };
  });

  results.sort((a, b) => b.scores.total - a.scores.total);

  return results;
}
