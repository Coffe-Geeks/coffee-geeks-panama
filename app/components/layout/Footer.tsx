import Link from "next/link";

// Votaciones y Del Origen a la Barra quedan fuera hasta que se activen;
// sus rutas siguen vivas, solo se retiran los enlaces.
const FOOTER_LINKS = {
  plataforma: [
    { label: "Inicio", href: "/home" },
    { label: "Participantes", href: "/participantes" },
    { label: "Guía de Experiencias", href: "/guia-de-experiencias" },
    { label: "Sobre nosotros", href: "/sobre-nosotros" },
  ],
  academia: [
    { label: "Specialty Coffee Academy", href: "/academia" },
    { label: "Guía del participante", href: "/guia-participante" },
    { label: "Guía del consumidor", href: "/guia-consumidor" },
    { label: "Pasaporte digital", href: "/pasaporte" },
  ],
  legal: [
    { label: "Política de privacidad", href: "/privacidad" },
    { label: "Términos del concurso", href: "/terminos" },
    { label: "Ley 81 · Datos personales", href: "/datos-personales" },
  ],
};

const SOCIAL_ICONS = [
  {
    label: "Facebook",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    type: "path",
  },
  {
    label: "Instagram",
    paths: [
      "rect:2,2,20,20,5,5",
      "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
      "line:17.5,6.5,17.51,6.5",
    ],
    complex: true,
  },
];

import { getSiteConfig } from "@/lib/siteConfig";

export default async function Footer() {
  const config = await getSiteConfig();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');
        .ft { background: #38050e; padding: 48px 0 0; }
        .ft-wrap { width: 100%; max-width: 1160px; margin: 0 auto; padding: 0 clamp(20px,5vw,60px); }
        .ft-top {
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; padding-bottom: 28px;
          border-bottom: 1px solid rgba(255,255,255,.07); flex-wrap: wrap;
        }
        .ft-logo img { height: 40px; width: auto; }
        .ft-contacts {
          display: flex; align-items: center; gap: 22px;
          flex-wrap: wrap; flex: 1; justify-content: center;
        }
        .ftc { display: flex; align-items: center; gap: 7px; font-size: 13px; color: rgba(255,255,255,.35); font-family: 'Barlow', sans-serif; }
        .ft-soc { display: flex; gap: 7px; flex-shrink: 0; }
        .fts {
          width: 30px; height: 30px; border-radius: 50px;
          border: 1px solid rgba(255,255,255,.1);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s;
          color: rgba(255,255,255,.45);
          text-decoration: none;
        }
        .fts:hover { border-color: #cddbf2; background: rgba(205,219,242,.1); color: #cddbf2; }
        .fts svg { width: 12px; height: 12px; stroke: currentColor; fill: none; strokeWidth: 1.5; }
        .ft-mid {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 32px; padding: 28px 0;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .ft-cl {
          font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase;
          color: #cddbf2; margin-bottom: 12px;
        }
        .ft-ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .ft-ul a {
          font-family: 'Barlow', sans-serif; font-size: 13px;
          color: rgba(255,255,255,.32); transition: color .2s; text-decoration: none;
        }
        .ft-ul a:hover { color: rgba(255,255,255,.75); }
        .ft-input {
          width: 100%; height: 37px; padding: 0 11px; margin-top: 7px;
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
          border-radius: 4px; color: #fff;
          font-family: 'Barlow', sans-serif; font-size: 14px;
          outline: none; transition: border-color .2s;
        }
        .ft-input::placeholder { color: rgba(255,255,255,.28); }
        .ft-input:focus { border-color: #cddbf2; border-width: 2px; }
        .ft-sub-btn {
          width: 100%; height: 36px; margin-top: 7px; border: none;
          border-radius: 4px; background: #cddbf2; color: #38050e;
          font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background .15s;
        }
        .ft-sub-btn:hover { background: #8AAFD4; color: #fff; }
        .ft-nl-desc { font-family: 'Barlow', sans-serif; font-size: 13px; color: rgba(255,255,255,.3); line-height: 1.6; margin-bottom: 8px; }
        .ft-bot {
          padding: 14px 0; display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 8px;
        }
        .ft-bot p { font-family: 'Barlow', sans-serif; font-size: 12px; color: rgba(255,255,255,.18); }
        .ft-bot a { color: rgba(255,255,255,.26); transition: color .2s; text-decoration: none; }
        .ft-bot a:hover { color: rgba(255,255,255,.6); }
        @media (max-width: 960px) {
          .ft-mid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .ft-mid { grid-template-columns: 1fr; }
          .ft-top { flex-direction: column; align-items: flex-start; }
          .ft-contacts { justify-content: flex-start; }

          /* En pantalla táctil los enlaces medían 28x18: demasiado chicos
             para el dedo. Se les da alto suficiente sin cambiar el diseño. */
          .ft-ul { gap: 0; }
          .ft-ul a {
            display: flex; align-items: center;
            min-height: 40px; font-size: 14px;
          }
          .fts { width: 40px; height: 40px; }
          .fts svg { width: 15px; height: 15px; }
        }
      `}</style>

      <footer className="ft">
        <div className="ft-wrap">
          {/* Top: logo · contacts · socials */}
          <div className="ft-top">
            <div className="ft-logo">
              <img src="/logo.webp" alt="Coffee Geeks Panamá" />
            </div>

            <div className="ft-contacts">
              {config.contactEmail && (
                <div className="ftc">
                  <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "#C4D4E8", fill: "none", strokeWidth: 1.5, flexShrink: 0 }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {config.contactEmail}
                </div>
              )}
              {config.contactWhatsApp && (
                <div className="ftc">
                  <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "#C4D4E8", fill: "none", strokeWidth: 1.5, flexShrink: 0 }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  WhatsApp · {config.contactWhatsApp}
                </div>
              )}
              {config.contactPhone2 && (
                <div className="ftc">
                  <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "#C4D4E8", fill: "none", strokeWidth: 1.5, flexShrink: 0 }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {config.contactPhone2}
                </div>
              )}
              {config.address && (
                <div className="ftc">
                  <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "#C4D4E8", fill: "none", strokeWidth: 1.5, flexShrink: 0 }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  {config.address}
                </div>
              )}
            </div>

            <div className="ft-soc">
              {config.facebook && (
                <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="fts" aria-label="Facebook">
                  <svg viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              )}
              {config.instagram && (
                <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="fts" aria-label="Instagram">
                  <svg viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
              {config.twitter && (
                <a href={config.twitter} target="_blank" rel="noopener noreferrer" className="fts" aria-label="Twitter">
                  <svg viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
              )}
              {config.youtube && (
                <a href={config.youtube} target="_blank" rel="noopener noreferrer" className="fts" aria-label="YouTube">
                  <svg viewBox="0 0 24 24">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Mid: columns */}
          <div className="ft-mid">
            <div>
              <div className="ft-cl">Plataforma</div>
              <ul className="ft-ul">
                {FOOTER_LINKS.plataforma.map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="ft-cl">Recursos</div>
              <ul className="ft-ul">
                {FOOTER_LINKS.academia.map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="ft-cl">Legal</div>
              <ul className="ft-ul">
                {FOOTER_LINKS.legal.map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="ft-cl">Newsletter</div>
              <p className="ft-nl-desc">Recibe noticias y avances del concurso.</p>
              <input className="ft-input" type="email" placeholder="tu@correo.com" />
              <button className="ft-sub-btn">Suscribirme →</button>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="ft-bot">
            <p>© 2026 Coffee Geeks Panamá · Todos los derechos reservados</p>
            <p>
              <Link href="/privacidad">Privacidad</Link>
              {" · "}
              <Link href="/terminos">Términos</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
