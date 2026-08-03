"use client";

import { useState } from "react";
import { setVotingRound, processRound1Advancement } from "@/app/actions/voting";

interface AdminVotacionesClientProps {
  currentRound: number;
  initialLeaderboard: any[];
}

export default function AdminVotacionesClient({ currentRound, initialLeaderboard }: AdminVotacionesClientProps) {
  const [loading, setLoading] = useState(false);

  const handleStartRound1 = async () => {
    if (!confirm("¿Iniciar Ronda 1? Esto abrirá la votación solo para Jueces Locales.")) return;
    setLoading(true);
    await setVotingRound(1);
    setLoading(false);
  };

  const handleCloseRound1 = async () => {
    if (!confirm("¿Cerrar Ronda 1 y procesar quienes avanzan a Ronda 2?")) return;
    setLoading(true);
    await processRound1Advancement();
    await setVotingRound(0); // Queda en pausa hasta que se inicie la Ronda 2 manually
    setLoading(false);
  };

  const handleStartRound2 = async () => {
    if (!confirm("¿Iniciar Ronda 2? Esto abrirá la votación para Público y Jurado Internacional.")) return;
    setLoading(true);
    await setVotingRound(2);
    setLoading(false);
  };

  const handleCloseEvent = async () => {
    if (!confirm("¿Cerrar el concurso completamente?")) return;
    setLoading(true);
    await setVotingRound(0);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* PANEL DE CONTROL */}
      <div className="bg-[#38050e] p-6 rounded-2xl border border-[#cddbf2]/10 shadow-xl">
        <h2 className="text-xl font-bold text-[#cddbf2] mb-4 border-b border-[#cddbf2]/10 pb-2">Control de Fases</h2>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${currentRound === 0 ? 'bg-red-500 animate-pulse' : 'bg-neutral-600'}`}></div>
            <p className="font-semibold text-[#cddbf2] flex-1">Fase inactiva (Pausa/Cerrado)</p>
            {currentRound !== 0 && (
              <button disabled={loading} onClick={handleCloseEvent} className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-200 text-sm font-bold rounded-lg border border-red-900 transition-colors">
                Detener Votaciones
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${currentRound === 1 ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-neutral-600'}`}></div>
            <p className="font-semibold text-[#cddbf2] flex-1">Ronda 1: Jurado Local</p>
            {currentRound === 0 && (
              <button disabled={loading} onClick={handleStartRound1} className="px-4 py-2 bg-[#cddbf2] hover:bg-[#cddbf2]/90 text-[#38050e] text-sm font-bold rounded-lg transition-colors">
                Iniciar Ronda 1
              </button>
            )}
            {currentRound === 1 && (
              <button disabled={loading} onClick={handleCloseRound1} className="px-4 py-2 bg-orange-700 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(194,65,12,0.5)]">
                Cerrar R1 y Procesar Avances
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${currentRound === 2 ? 'bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]' : 'bg-neutral-600'}`}></div>
            <p className="font-semibold text-[#cddbf2] flex-1">Ronda 2: Gran Final (Público + Jurados)</p>
            {currentRound === 0 && (
              <button disabled={loading} onClick={handleStartRound2} className="px-4 py-2 bg-[#cddbf2] hover:bg-[#cddbf2]/90 text-[#38050e] text-sm font-bold rounded-lg transition-colors">
                Iniciar Ronda 2
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LEADERBOARD */}
      <div className="bg-[#38050e] p-6 rounded-2xl border border-[#cddbf2]/10 overflow-x-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#cddbf2]">Ranking en Tiempo Real (Ronda {currentRound === 1 ? 1 : 2})</h2>
          <span className="text-xs font-bold text-[#cddbf2]/50 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-[#cddbf2]/10">
            {currentRound === 1 ? "Promedio General Escala 1-5" : "Fórmula: 0.25P + 0.50T + 0.25E"}
          </span>
        </div>

        {initialLeaderboard.length === 0 ? (
          <p className="text-[#cddbf2]/50 text-center py-10 font-medium tracking-wide">
            No hay datos suficientes o la Ronda {currentRound === 1 ? 1 : 2} no ha recibido votos aún.
          </p>
        ) : (
          <table className="w-full text-left text-sm text-[#cddbf2]">
            <thead className="bg-[#2a040b] text-xs uppercase text-[#cddbf2]/70 font-bold tracking-wider border-b border-[#cddbf2]/10">
              <tr>
                <th className="px-4 py-4">Pos</th>
                <th className="px-4 py-4">Cafetería</th>
                <th className="px-4 py-4">Barista Destacado</th>
                <th className="px-4 py-4">Cat.</th>
                <th className="px-4 py-4 text-center">Votos (R{currentRound === 1 ? 1 : 2})</th>
                {currentRound === 1 ? (
                  <>
                    <th className="px-4 py-4 text-center">Promedio (1-5)</th>
                    <th className="px-4 py-4 text-center">Estado</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-4 text-center" title="Público (20%)">Público (20%)</th>
                    <th className="px-4 py-4 text-center" title="Local (30%)">Local (30%)</th>
                    <th className="px-4 py-4 text-center" title="Intl (50%)">Intl (50%)</th>
                  </>
                )}
                <th className="px-4 py-4 text-right">Puntaje Total</th>
              </tr>
            </thead>
            <tbody>
              {initialLeaderboard.map((c, idx) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4 font-black text-[#cddbf2]">{idx + 1}</td>
                  <td className="px-4 py-4 font-bold text-[#cddbf2]">{c.name}</td>
                  <td className="px-4 py-4">{c.barista}</td>
                  <td className="px-4 py-4">
                    <span className="bg-black/20 border border-[#cddbf2]/10 px-2 py-1 rounded text-xs font-semibold text-[#cddbf2]/70">
                      {c.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center font-bold">{c.votesCount}</td>
                  {currentRound === 1 ? (
                    <>
                      <td className="px-4 py-4 text-center text-[#cddbf2] font-semibold">{c.scores.total.toFixed(2)}</td>
                      <td className="px-4 py-4 text-center font-bold">
                        {c.scores.total >= 4 ? (
                          <span className="text-green-400 bg-green-900/30 px-2 py-1 rounded">Clasifica</span>
                        ) : (
                          <span className="text-red-400 bg-red-900/30 px-2 py-1 rounded">En riesgo</span>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-4 text-center text-blue-300">{(c.scores.public * 100).toFixed(1)}%</td>
                      <td className="px-4 py-4 text-center text-green-300">{(c.scores.local * 100).toFixed(1)}%</td>
                      <td className="px-4 py-4 text-center text-purple-300">{(c.scores.intl * 100).toFixed(1)}%</td>
                    </>
                  )}
                  <td className="px-4 py-4 text-right font-black text-lg text-[#cddbf2]">
                    {currentRound === 1 ? c.scores.total.toFixed(2) : (c.scores.total * 100).toFixed(2) + ' pts'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
