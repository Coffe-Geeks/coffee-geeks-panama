"use client";

import { useState } from "react";
import VoteModal from "@/app/components/VoteModal";

interface RankingSectionProps {
  podium: any[];
  rest: any[];
  votingEndDate?: string;
}

export default function RankingSection({ podium, rest, votingEndDate }: RankingSectionProps) {
  const [voteModal, setVoteModal] = useState<{ open: boolean; preselected?: string }>({ open: false });

  const openVote = () => setVoteModal({ open: true });
  const closeVote = () => setVoteModal({ open: false });
  return (
    <>
      <style>{`
        .rank-sec { background: #38050e; padding: 80px 0; }
        .rank-wrap { width: 100%; max-width: 1160px; margin: 0 auto; padding: 0 clamp(20px,5vw,60px); }
        .rank-hd { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 26px; flex-wrap: wrap; }
        .eyebrow-light { display: flex; align-items: center; gap: 9px; margin-bottom: 6px; }
        .eyebrow-line-l { width: 24px; height: 2px; background: #cddbf2; flex-shrink: 0; }
        .eyebrow-text-l { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: #cddbf2; }
        .rank-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(28px,4vw,42px); font-weight: 900; text-transform: uppercase; color: #fff; line-height: .92; margin-top: 6px; }
        .rank-title span { color: rgba(255,255,255,.4); font-weight: 300; }
        .reg-label { font-family: 'Barlow', sans-serif; font-size: 12px; color: rgba(255,255,255,.3); margin-bottom: 2px; }
        .reg-date { font-family: 'Barlow Condensed', sans-serif; font-size: 1.4rem; font-weight: 900; text-transform: uppercase; color: #cddbf2; }
        .podium { display: grid; grid-template-columns: 1fr 1.15fr 1fr; gap: 1px; background: rgba(255,255,255,.08); border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,.07); margin-bottom: 16px; }
        .pc { padding: 22px 18px 20px; display: flex; flex-direction: column; align-items: center; gap: 7px; position: relative; background: rgba(255,255,255,.04); }
        .pc.gold { background: rgba(205,219,242,.07); }
        .rb { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid rgba(196,212,232,.3); display: flex; align-items: center; justify-content: center; font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 900; color: rgba(255,255,255,.5); flex-shrink: 0; }
        .rb.rs { border-color: #BFC4C9; color: #BFC4C9; }
        .rb.rg { border-color: #cddbf2; color: #cddbf2; }
        .rb.rb2 { border-color: #C89A5F; color: #C89A5F; }
        .pc-ico { width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,.12); border: 1.5px solid rgba(196,212,232,.2); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .pc-ico img { width: 36px; height: 36px; object-fit: contain; }
        .pc-name { font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 900; text-transform: uppercase; color: #fff; text-align: center; }
        .pc.gold .pc-name { font-size: 1.3rem; }
        .pc-cat { font-family: 'Barlow', sans-serif; font-size: 11px; color: rgba(255,255,255,.3); text-align: center; }
        .pc-v { font-family: 'Barlow', sans-serif; font-size: 13px; color: rgba(255,255,255,.45); text-align: center; }
        .pc.gold .pc-v { color: #cddbf2; font-weight: 600; }
        .rank-rest { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 24px; }
        .rr { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,.04); border-radius: 10px; padding: 11px 14px; border: 1px solid rgba(255,255,255,.06); }
        .rr-pos { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 900; color: rgba(255,255,255,.18); flex-shrink: 0; width: 22px; }
        .rr-info { flex: 1; }
        .rr-name { font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 600; color: rgba(255,255,255,.8); }
        .rr-cat { font-family: 'Barlow', sans-serif; font-size: 12px; color: rgba(255,255,255,.3); }
        .rr-v { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; color: rgba(255,255,255,.25); }
        .vote-cta { display: flex; align-items: center; justify-content: space-between; gap: 16px; background: rgba(205,219,242,.08); border-radius: 12px; padding: 20px 24px; border: 1px solid rgba(205,219,242,.12); flex-wrap: wrap; }
        .vote-cta h4 { font-family: 'Barlow', sans-serif; font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 3px; }
        .vote-cta p { font-family: 'Barlow', sans-serif; font-size: 14px; color: rgba(255,255,255,.44); }
        .btn-dark { height: 44px; padding: 0 28px; border-radius: 50px; border: none; background: #cddbf2; color: #38050e; font-family: 'Barlow', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: background .15s; white-space: nowrap; }
        .btn-dark:hover { background: #8AAFD4; color: #fff; }
        @media (max-width: 640px) {
          .podium { grid-template-columns: 1fr; }
          .rank-rest { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="rank-sec">
        <div className="rank-wrap">
          <div className="rank-hd">
            <div>
              <div className="eyebrow-light">
                <div className="eyebrow-line-l" />
                <span className="eyebrow-text-l">Marcador en vivo</span>
              </div>
              <h2 className="rank-title">Los protagonistas<br /><span>de la ruta del café</span></h2>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className="reg-label">Registro cierra</p>
              <p className="reg-date">{votingEndDate || "PRÓXIMAMENTE"}</p>
            </div>
          </div>

          {/* Podium top 3 */}
          <div className="podium">
            {podium.map((p) => (
              <div className={`pc${p.isGold ? " gold" : ""}`} key={p.pos}>
                <div className={`rb ${p.rankCls}`}>{p.posLabel}</div>
                <div className="pc-ico">
                   {p.img ? (
                      <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   ) : (
                      <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, fill: "rgba(255,255,255,.3)" }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                   )}
                </div>
                <div className="pc-name">{p.name}</div>
                <div className="pc-cat">{p.cat}</div>
                <div className="pc-v">{p.votes} {p.isGold ? '· Líder' : ''}</div>
              </div>
            ))}
          </div>

          {/* Places 4+ */}
          <div className="rank-rest">
            {rest.map((r) => (
              <div className="rr" key={r.pos}>
                <div className="rr-pos">{r.pos}</div>
                <div className="rr-info">
                  <div className="rr-name">{r.name}</div>
                  <div className="rr-cat">{r.cat}</div>
                </div>
                <div className="rr-v">{r.votes}</div>
              </div>
            ))}
          </div>

          {/* Vote CTA */}
          <div className="vote-cta">
            <div>
              <h4>¿Ya visitaste alguna cafetería participante?</h4>
              <p>Registra tu visita y emite tu voto antes del {votingEndDate || "final del evento"}.</p>
            </div>
            <button className="btn-dark" onClick={openVote}>Emitir mi voto →</button>
          </div>
        </div>
      </section>

      <VoteModal
        open={voteModal.open}
        preselected={voteModal.preselected}
        onClose={closeVote}
      />
    </>
  );
}


