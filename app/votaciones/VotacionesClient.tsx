"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import VoteModal from "@/app/components/VoteModal";

interface VotacionesClientProps {
  initialRound: number;
  initialCafeterias: any[];
}

export default function VotacionesClient({ initialRound, initialCafeterias }: VotacionesClientProps) {
  const [voteModal, setVoteModal] = useState<{ 
    open: boolean; 
    preselected?: string | null
  }>({ open: false });

  const openVote = (cafeteriaId: string) => setVoteModal({ open: true, preselected: cafeteriaId });
  const closeVote = () => setVoteModal({ open: false });

  const cafeterias = initialCafeterias;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .ph{position:relative;padding-top:58px;background:linear-gradient(135deg,#4a0a15 0%,#38050e 55%,#24060c 100%)}
        .ph-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.62}
        .ph-sc{position:absolute;inset:0;background:radial-gradient(120% 100% at 80% 0%,rgba(120,20,40,.35) 0%,transparent 55%)}
        .ph-cnt{position:relative;z-index:2;padding:44px 0 44px}
        .ph-flex{display:flex;align-items:center;justify-content:space-between;gap:40px}
        .ph-txt{flex:1}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,6vw,64px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92;margin-bottom:4px}
        .ph-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(22px,3vw,32px);font-weight:400;text-transform:uppercase;color:rgba(196,212,232,.55)}
        .ph-logo{width:clamp(120px,18vw,220px);height:auto;filter:drop-shadow(0 10px 30px rgba(0,0,0,0.3));animation:float 6s ease-in-out infinite}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:#38050e;opacity:.7;transition:color .2s;text-decoration:none}
        .bread-i a:hover{color:#38050e;opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        .rk-page{padding:44px 0 64px;background:#f4efe4}
        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}
        .eyebrow-row{display:flex;align-items:center;gap:9px;margin-bottom:6px;justify-content:center}
        .eyebrow-line{width:24px;height:2px;background:#38050e;flex-shrink:0}
        .eyebrow-text{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#38050e}

        .rkr{background:#fff;border-radius:16px;overflow:hidden;display:flex;align-items:stretch;box-shadow:0 1px 2px rgba(0,0,0,.12),0 1px 3px 1px rgba(0,0,0,.08);transition:box-shadow .2s,transform .2s;border:1px solid #cddbf2;margin-bottom:9px}
        .rkr:hover{box-shadow:0 4px 8px 3px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.12);transform:translateX(3px)}
        .rkr-photo{width:170px;flex-shrink:0;background-size:cover;background-position:center;background-color:#eee}
        .rkr-info{flex:1;padding:13px 16px;display:flex;flex-direction:column;justify-content:center}
        .rkr-name{font-family:'Barlow Condensed',sans-serif;font-size:1.4rem;font-weight:900;text-transform:uppercase;color:#38050e;margin-bottom:1px}
        .rkr-sub{font-family:'Barlow Condensed',sans-serif;font-size:.8rem;font-weight:700;text-transform:uppercase;color:#38050e;opacity:.6;margin-bottom:6px}
        .rkr-meta{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .rkr-cat{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#38050e;opacity:.7;font-family:'Barlow',sans-serif}
        .rkr-loc{display:flex;align-items:center;gap:3px;font-size:11px;color:#38050e;opacity:.6;font-family:'Barlow',sans-serif}
        .rkr-right{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:13px 14px;gap:9px;background:rgba(56,5,14,.03);border-left:1px solid #cddbf2;min-width:140px}
        .rkr-btn{width:100%;height:36px;border-radius:50px;border:none;background:#38050e;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:.85rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .2s;white-space:nowrap}
        .rkr-btn:hover{background:#cddbf2;color:#38050e}
        .rkr-btn:disabled{background:#ccc;color:#666;cursor:not-allowed}
        
        @media(max-width:960px){.rkr-photo{width:110px}}
        @media(max-width:768px){
          .ph-flex{flex-direction:column;align-items:flex-start;gap:25px}
          .ph-logo{width:140px}
        }
        @media(max-width:640px){.rkr-photo{display:none}}
      `}</style>

      <Navbar />

      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-flex">
              <div className="ph-txt">
                <div className="ph-eye">Temporada 2026</div>
                <h1 className="ph-h1">Votaciones Oficiales</h1>
                <h2 className="ph-h2">
                  {initialRound === 0 ? "Concurso Cerrado" : initialRound === 1 ? "Ronda 1: Evaluación Local" : "Ronda 2: Gran Final"}
                </h2>
              </div>
              <div className="ph-side">
                <img src="/concurso.webp" alt="Coffee Geeks Logo" className="ph-logo" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}><polyline points="9 18 15 12 9 6" /></svg>
            <span>Votaciones Ronda {initialRound}</span>
          </div>
        </div>
      </div>

      <main className="rk-page">
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="eyebrow-row">
              <div className="eyebrow-line" />
              <span className="eyebrow-text">
                {initialRound === 0 ? "Esperando el inicio del evento" : `Cafeterías en competencia - Ronda ${initialRound}`}
              </span>
              <div className="eyebrow-line" />
            </div>
            
            {initialRound === 0 ? (
              <div className="py-12">
                <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "2rem", fontWeight: 900, textTransform: "uppercase", color: "#38050e" }}>
                  Las votaciones están cerradas en este momento.
                </h2>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {cafeterias.length === 0 ? (
                  <p className="py-10 text-center font-bold text-[#38050e]/60">No hay cafeterías activas para esta ronda.</p>
                ) : (
                  cafeterias.map((c: any) => (
                    <div key={c.id} className="rkr border-l-4 border-l-[#38050e]">
                      <div className="rkr-photo" style={{ backgroundImage: `url('${c.coverImage || '/background.webp'}')` }} />
                      <div className="rkr-info">
                        <div className="rkr-name">{c.name}</div>
                        <div className="rkr-sub">{c.businessType === "coffee" ? "Coffee Shop" : c.businessType === "hotel" ? "Hotel" : "Restaurante"}</div>
                        <div className="rkr-meta">
                          <span className="rkr-cat font-bold text-[#38050e] bg-[#cddbf2]/30 px-2 py-0.5 rounded">
                            {c.competitionCategory || "Sin categoría"}
                          </span>
                          <span className="rkr-loc">📍 {c.neighborhood || "Panamá"}</span>
                          <span className="rkr-loc">👨‍🍳 Barista: {c.baristaName || "-"}</span>
                          <span className="rkr-loc font-bold text-[#38050e]">⭐ {c.votesCount || 0} votos</span>
                        </div>
                      </div>
                      <div className="rkr-right">
                        <button
                          className="rkr-btn"
                          disabled={!c.baristaId}
                          onClick={() => openVote(c.id)}
                        >
                          {c.baristaId ? "Emitir Voto" : "Sin Barista"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <VoteModal
        open={voteModal.open}
        preselected={voteModal.preselected}
        onClose={closeVote}
      />
    </>
  );
}
