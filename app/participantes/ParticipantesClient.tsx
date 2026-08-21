"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import VoteModal from "@/app/components/VoteModal";
import BannerBrolls from "@/app/components/BannerBrolls";
import { getSlugId } from "@/lib/utils";

// B-rolls de los baristas trabajando con las manos (los del hero del
// home): el banner muestra a los protagonistas haciendo las bebidas.
const BLOB_BROLLS = "https://67nfjlu2uec5rb7z.public.blob.vercel-storage.com/brolls";
const BANNER_BROLLS = [
  `${BLOB_BROLLS}/cg_broll_01_foodbarn_espresso.mp4`,
  `${BLOB_BROLLS}/cg_broll_04_tosto_filtrado.mp4`,
  `${BLOB_BROLLS}/cg_broll_05_sip_espresso.mp4`,
  `${BLOB_BROLLS}/cg_broll_08_leto_filtrado.mp4`,
  `${BLOB_BROLLS}/cg_broll_02_sisu_filtrado.mp4`,
  `${BLOB_BROLLS}/cg_broll_07_momo_espresso.mp4`,
];
const BANNER_POSTER = "https://67nfjlu2uec5rb7z.public.blob.vercel-storage.com/banners/banner-participantes-espresso.jpg";

const CHIPS = [
  { label: "Todos", value: "all" },
  { label: "Coffee Shops", value: "coffee" },
  { label: "Hoteles", value: "hotel" },
  { label: "Restaurantes", value: "rest" },
];


export default function ParticipantesClient({ initialShops }: { initialShops: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("search");

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  // "destacados" respeta el orden que envía el servidor: primero los
  // participantes con ficha y fotos completas
  const [sortBy, setSortBy] = useState("destacados");
  const [voteModal, setVoteModal] = useState<{ open: boolean; preselected?: string }>({ open: false });

  useEffect(() => {
    if (querySearch) {
      setSearch(querySearch);
    }
  }, [querySearch]);

  const openVote = (id?: string) => setVoteModal({ open: true, preselected: id });
  const closeVote = () => setVoteModal({ open: false });

  const filtered = initialShops
    .filter((s) => filter === "all" || s.type === filter)
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "destacados") return 0;
      if (sortBy === "votes") return b.votes - a.votes;
      return a.name.localeCompare(b.name);
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        /* ── Page hero ── */
        .ph{position:relative;padding-top:58px;background:linear-gradient(135deg,#4a0a15 0%,#38050e 55%,#24060c 100%)}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(100deg,rgba(22,4,9,.82) 0%,rgba(22,4,9,.55) 38%,rgba(0,0,0,.18) 68%,rgba(0,0,0,.3) 100%)}
        .ph-sello{position:absolute;right:clamp(20px,5vw,60px);top:72px;width:84px;height:84px;opacity:.55;animation:spin2 28s linear infinite}
        @keyframes spin2{to{transform:rotate(360deg)}}
        .ph-cnt{position:relative;z-index:2;padding:64px 0 64px}
        .ph-flex{display:flex;align-items:center;justify-content:space-between;gap:40px}
        .ph-txt{flex:1}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,6vw,64px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92;margin-bottom:4px}
        .ph-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(22px,3vw,32px);font-weight:400;text-transform:uppercase;color:rgba(196,212,232,.55)}
        .ph-logo{width:clamp(120px,18vw,220px);height:auto;filter:drop-shadow(0 10px 30px rgba(0,0,0,0.3));animation:float 6s ease-in-out infinite}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

        /* ── Breadcrumb ── */
        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:#38050e;opacity:.7;transition:color .2s;text-decoration:none}
        .bread-i a:hover{color:#38050e;opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        /* ── Participantes list section ── */
        .part-sec{background:#f4efe4;padding:24px 0 80px}
        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}

        /* Controls */
        .shops-ctrl{display:flex;align-items:center;gap:10px;margin-bottom:22px;flex-wrap:wrap}
        .shops-badge{font-family:'Barlow Condensed',sans-serif;font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#38050e;background:#cddbf2;padding:5px 13px;border-radius:50px;border:1px solid rgba(56,5,14,.12);flex-shrink:0}
        .m3s{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #cddbf2;border-radius:8px;padding:0 10px;height:34px}
        .m3s input{border:none;outline:none;font-family:'Barlow',sans-serif;font-size:14px;color:#38050e;background:transparent;width:160px}
        .chip{display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:8px;border:1px solid #cddbf2;background:transparent;color:#38050e;opacity:.7;font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s}
        .chip:hover{background:#cddbf2;opacity:1}
        .chip.on{background:#38050e;color:#cddbf2;border-color:#38050e;opacity:1}
        .m3-sel{border:1px solid #cddbf2;border-radius:8px;padding:5px 10px;font-family:'Barlow',sans-serif;font-size:14px;color:#38050e;background:#fff;outline:none;margin-left:auto;cursor:pointer}

        /* Grid */
        .sc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .sc{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.12),0 1px 3px 1px rgba(0,0,0,.08);transition:box-shadow .25s,transform .25s;cursor:pointer;border:1px solid #cddbf2}
        .sc:hover{box-shadow:0 4px 8px 3px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.12);transform:translateY(-5px)}
        .sc-img{width:100%;aspect-ratio:1/1;background-size:cover;background-position:center;display:flex;align-items:flex-start;justify-content:flex-end;padding:9px}
        .sc-badge{font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:.04em;background:#38050e;color:#fff;padding:4px 9px;border-radius:50px}
        .sc-body{padding:13px 14px 11px}
        .sc-cat{font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#38050e;opacity:.6;margin-bottom:1px}
        .sc-name{font-family:'Barlow Condensed',sans-serif;font-size:1.45rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05;margin-bottom:4px}
        .sc-loc{display:flex;align-items:center;gap:5px;font-family:'Barlow',sans-serif;font-size:13px;color:#38050e;opacity:.5;margin-bottom:11px}
        .sc-acts{display:flex;gap:7px;padding-top:9px;border-top:1px solid #cddbf2}
        .scb{flex:1;height:33px;border-radius:50px;border:none;font-family:'Barlow',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s}
        .scb-v{background:#38050e;color:#fff}
        .scb-v:hover{background:#cddbf2;color:#38050e}
        .scb-p{background:#f4efe4;color:#38050e}
        .scb-p:hover{background:#cddbf2}

        @media(max-width:960px){.sc-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:768px){
          .ph-flex{flex-direction:column;align-items:flex-start;gap:25px}
          .ph-logo{width:140px}
        }
        @media(max-width:640px){.sc-grid{grid-template-columns:1fr}}
      `}</style>

      <Navbar />

      {/* Page Hero */}
      <div className="ph">
        <BannerBrolls videos={BANNER_BROLLS} poster={BANNER_POSTER} />
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-flex">
              <div className="ph-txt">
                <div className="ph-eye">Coffee Geeks Panamá · Temporada 2026</div>
                <h1 className="ph-h1">Participantes</h1>
                <h2 className="ph-h2">Los protagonistas<br />de la ruta del café</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}><polyline points="9 18 15 12 9 6" /></svg>
            <span>Participantes</span>
          </div>
        </div>
      </div>

      {/* List */}
      <main className="part-sec">
        <div className="wrap">
          {/* Controls */}
          <div className="shops-ctrl">
            <span className="shops-badge">{initialShops.length} cafeterías registradas</span>
            <div className="m3s">
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "#38050e", opacity: 0.6, fill: "none", strokeWidth: 1.5, flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Buscar cafetería..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {CHIPS.map((c) => (
              <button
                key={c.value}
                className={`chip${filter === c.value ? " on" : ""}`}
                onClick={() => setFilter(c.value)}
              >
                {c.label}
              </button>
            ))}
            <select
              className="m3-sel"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="destacados">Destacados</option>
              <option value="votes">Por votos</option>
              <option value="name">Nombre A–Z</option>
            </select>
          </div>

          {/* Cards */}
          <div className="sc-grid">
            {filtered.map((shop) => (
              <div
                className="sc"
                key={shop.id}
                onClick={() => router.push(`/participantes/${getSlugId(shop.name, shop.id)}`)}
              >
                <div className="sc-img" style={{ backgroundImage: `url('${shop.img}')` }}>
                  <span className="sc-badge">{shop.votes} votos</span>
                </div>
                <div className="sc-body">
                  <div className="sc-cat">{shop.cat}</div>
                  <div className="sc-name">{shop.name}</div>
                  <div className="sc-loc">
                    <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, stroke: "#38050e", fill: "none", strokeWidth: 1.5, flexShrink: 0 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {shop.loc}
                  </div>
                  <div className="sc-acts">
                    <button className="scb scb-v" onClick={(e) => { e.stopPropagation(); openVote(shop.id); }}>Votar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "#38050e", opacity: 0.5, fontFamily: "'Barlow',sans-serif", padding: "40px 0" }}>
              No se encontraron cafeterías con ese filtro.
            </p>
          )}
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
