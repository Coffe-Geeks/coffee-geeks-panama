"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import VoteModal from "@/app/components/VoteModal";

// Votaciones sigue fuera del menú hasta que se active; su ruta existe.
// Nuestro Método pasará a ser un desplegable bajo Sobre Nosotros.
type NavLink = { label: string; href: string; children?: { label: string; href: string }[] };

const NAV_LINKS: NavLink[] = [
  { label: "Descúbrenos", href: "/" },
  {
    label: "Sobre Nosotros",
    href: "/sobre-nosotros",
    children: [
      { label: "Quiénes somos", href: "/sobre-nosotros#quienes-somos" },
      { label: "Qué hacemos", href: "/sobre-nosotros#que-hacemos" },
      { label: "Cómo lo hacemos", href: "/sobre-nosotros#como-lo-hacemos" },
      { label: "Nuestro Método", href: "/nuestro-metodo" },
    ],
  },
  { label: "Participantes", href: "/participantes" },
  { label: "Guía de Experiencias", href: "/guia-de-experiencias" },
  { label: "Academia", href: "/academia" },
  { label: "Pasaporte", href: "/pasaporte" },
  { label: "Blog", href: "/blogs" },
  { label: "Tienda", href: "/tienda" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    // Check session
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => setIsLoggedIn(data.isLoggedIn))
      .catch(() => setIsLoggedIn(false));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Cerrar el menú al navegar y evitar que el fondo se desplace detrás
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/participantes?search=${encodeURIComponent(searchTerm.trim())}`);
    setSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <>
      <style>{`
        .tbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          background: #38050e;
          transition: box-shadow .3s;
        }
        .tbar.up { box-shadow: 0 4px 8px 3px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.12); }
        .tbar-i { display: flex; align-items: stretch; height: 58px; }
        .tb-brand {
          display: flex; align-items: center; gap: 10px;
          padding: 0 18px 0 24px; background: #38050e; flex-shrink: 0;
          cursor: pointer;
          transition: background .2s; text-decoration: none;
        }
        .tb-brand:hover { background: #2a040b }
        .tb-brand img { height: 30px; width: auto; }
        .tb-bname {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: .9rem; font-weight: 700; color: #fff;
          text-transform: uppercase; letter-spacing: .04em;
          line-height: 1; display: flex; flex-direction: column;
        }
        .tb-bname small { font-size: .55rem; font-weight: 400; letter-spacing: .2em; opacity: .5; line-height: 1.4; }
        .tb-nav { flex: 1; display: flex; align-items: center; justify-content: center; gap: 2px; padding: 0 8px; }
        .tb-a {
          font-family: 'Barlow', sans-serif; font-size: .74rem; font-weight: 500;
          letter-spacing: .08em; text-transform: uppercase;
          color: rgba(255,255,255,.5); padding: 6px 13px;
          border-radius: 50px; transition: all .2s;
          cursor: pointer; text-decoration: none; user-select: none;
        }
        .tb-a:hover { color: rgba(255,255,255,.9); background: rgba(255,255,255,.07); }
        .tb-a.active { color: #cddbf2; background: rgba(205,219,242,.12); }
        /* ── Desplegable ── */
        .tb-drop { position: relative; display: flex; align-items: center; }
        .tb-drop > .tb-a { display: inline-flex; align-items: center; gap: 5px; }
        .tb-caret { width: 11px; height: 11px; stroke: currentColor; fill: none; stroke-width: 2.5;
          transition: transform .2s; flex-shrink: 0; }
        .tb-drop:hover .tb-caret, .tb-drop:focus-within .tb-caret { transform: rotate(180deg); }

        .tb-panel {
          position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(-6px);
          min-width: 214px; padding: 7px; border-radius: 14px;
          background: #38050e; border: 1px solid rgba(205,219,242,.16);
          box-shadow: 0 12px 30px rgba(0,0,0,.34);
          display: flex; flex-direction: column; gap: 1px;
          opacity: 0; pointer-events: none;
          transition: opacity .2s ease, transform .2s ease;
        }
        /* focus-within lo abre también con teclado */
        .tb-drop:hover .tb-panel, .tb-drop:focus-within .tb-panel {
          opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0);
        }
        /* Puente invisible: el panel queda a 6px y sin esto el mouse
           lo pierde al bajar desde el enlace */
        .tb-panel::before { content: ''; position: absolute; left: 0; right: 0; top: -8px; height: 8px; }

        .tb-panel-a {
          font-family: 'Barlow', sans-serif; font-size: .82rem; font-weight: 500;
          color: rgba(255,255,255,.72); padding: 9px 13px; border-radius: 9px;
          text-decoration: none; white-space: nowrap; transition: all .15s;
        }
        .tb-panel-a:hover { background: rgba(205,219,242,.13); color: #cddbf2; }

        .tb-act { display: flex; align-items: center; gap: 4px; padding: 0 18px 0 8px; }
        .ibtn {
          width: 38px; height: 38px; border-radius: 50px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.08); color: rgba(255,255,255,.75);
          cursor: pointer; transition: background .15s; border: none;
          position: relative; overflow: hidden;
        }
        .ibtn:hover { background: rgba(255,255,255,.15); }
        .btn-vote {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          height: 32px; padding: 0 14px; border-radius: 50px;
          font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 500;
          background: #cddbf2; color: #38050e; border: none;
          cursor: pointer; transition: all .2s; white-space: nowrap;
        }
        .btn-vote:hover { background: #8AAFD4; color: #fff; }
        /* ── Menú móvil ── */
        .tb-burger { display: none; }

        .mob-menu {
          position: fixed; inset: 58px 0 0 0; z-index: 190;
          background: #38050e; padding: 18px 24px 40px;
          overflow-y: auto;
          transform: translateY(-8px); opacity: 0; pointer-events: none;
          transition: opacity .25s ease, transform .25s ease;
        }
        .mob-menu.open { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .mob-a {
          display: block; padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,.08);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.5rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .02em; color: rgba(255,255,255,.75);
          text-decoration: none; transition: color .2s;
        }
        .mob-a:hover, .mob-a.active { color: #cddbf2; }
        /* Subenlaces: mismo alto táctil, menor peso visual */
        .mob-sub { padding: 4px 0 10px 16px; border-left: 2px solid rgba(205,219,242,.22); margin-left: 2px; }
        .mob-sub-a {
          display: flex; align-items: center; min-height: 40px;
          font-family: 'Barlow', sans-serif; font-size: 15px; font-weight: 400;
          color: rgba(255,255,255,.55); text-decoration: none; transition: color .2s;
        }
        .mob-sub-a:hover { color: #cddbf2; }
        .mob-foot { display: flex; gap: 10px; margin-top: 22px; }
        .mob-btn {
          flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          height: 44px; border-radius: 50px; border: 1px solid rgba(205,219,242,.35);
          background: transparent; color: #cddbf2;
          font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 500;
          text-decoration: none; cursor: pointer; transition: all .2s;
        }
        .mob-btn:hover { background: rgba(205,219,242,.12); }

        @media (max-width: 640px) {
          /* Los enlaces pasan al menú desplegable */
          .tb-nav { display: none; }
          .tb-burger { display: flex; }
          /* Buscador y cuenta viven dentro del menú: liberan espacio arriba */
          .tb-act .ibtn { display: none; }

          /* Compactar para que "Votar" no se salga del borde */
          .tb-brand { padding: 0 10px 0 14px; gap: 8px; }
          .tb-brand img { height: 26px; }
          .tb-bname { font-size: .78rem; }
          .tb-bname small { font-size: .5rem; }
          .tb-act { padding: 0 12px 0 4px; gap: 6px; flex-shrink: 0; }
          .btn-vote { padding: 0 12px; font-size: 12px; }
        }

        /* Pantallas muy angostas: el logotipo cede primero */
        @media (max-width: 380px) {
          .tb-bname { display: none; }
          .tb-brand { padding: 0 8px 0 12px; }
        }

        /* ── Search Modal ── */
        .search-modal {
          position: fixed; inset: 0; z-index: 300;
          background: #38050e;
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none; transition: opacity .3s;
        }
        .search-modal.open { opacity: 1; pointer-events: auto; }
        .sm-cnt { width: 100%; max-width: 600px; padding: 20px; text-align: center; }
        .sm-close {
          position: absolute; top: 20px; right: 20px;
          background: none; border: none; color: #fff; cursor: pointer;
          opacity: .6; transition: opacity .2s;
        }
        .sm-close:hover { opacity: 1; }
        .sm-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2.5rem; font-weight: 900; color: #fff;
          text-transform: uppercase; margin-bottom: 24px;
        }
        .sm-form { position: relative; }
        .sm-input {
          width: 100%; background: none; border: none;
          border-bottom: 2px solid rgba(255, 255, 255, .2);
          padding: 12px 0; font-family: 'Barlow', sans-serif;
          font-size: 1.5rem; color: #fff; outline: none;
          transition: border-color .3s;
        }
        .sm-input:focus { border-color: #cddbf2; }
        .sm-input::placeholder { color: rgba(255, 255, 255, .3); }
        .sm-hint {
          display: block; margin-top: 12px; font-family: 'Barlow', sans-serif;
          font-size: .8rem; color: rgba(255, 255, 255, .4);
        }
      `}</style>

      <nav className={`tbar${scrolled ? " up" : ""}`}>
        <div className="tbar-i">
          {/* Brand */}
          <Link href="/" className="tb-brand">
            <img src="/fav.webp" alt="CGP" style={{ height: 30 , borderRight: "1px solid rgba(255, 255, 255, 0.7)" }} />
            <div className="tb-bname">
              Coffee Geeks
              <small>Panamá</small>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="tb-nav">
            {NAV_LINKS.map((link) => {
              const activo =
                pathname === link.href ||
                !!link.children?.some((c) => pathname === c.href.split("#")[0]);

              if (!link.children) {
                return (
                  <Link key={link.href} href={link.href} className={`tb-a${activo ? " active" : ""}`}>
                    {link.label}
                  </Link>
                );
              }

              // El contenedor mantiene abierto el panel también al enfocar
              // con teclado, no solo al pasar el mouse
              return (
                <div className="tb-drop" key={link.href}>
                  <Link href={link.href} className={`tb-a${activo ? " active" : ""}`}>
                    {link.label}
                    <svg viewBox="0 0 24 24" className="tb-caret" aria-hidden="true">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Link>
                  <div className="tb-panel">
                    {link.children.map((c) => (
                      <Link key={c.href} href={c.href} className="tb-panel-a">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="tb-act">
            {/* Search */}
            <button 
              className="ibtn" 
              aria-label="Buscar"
              onClick={() => setSearchOpen(true)}
            >
              <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "rgba(255,255,255,.75)", fill: "none", strokeWidth: 1.5 }}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* User */}
            <Link 
              href={isLoggedIn ? "/perfil" : "/login"} 
              className="ibtn" 
              aria-label="Mi cuenta"
              style={{ textDecoration: "none" }}
            >
              <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "rgba(255,255,255,.75)", fill: "none", strokeWidth: 1.5 }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Vote CTA */}
            <button className="btn-vote" onClick={() => setVoteModalOpen(true)}>
              <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "currentColor", fill: "none", strokeWidth: 2.5, flexShrink: 0 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Votar
            </button>

            {/* Menú móvil */}
            <button
              className="ibtn tb-burger"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: "rgba(255,255,255,.85)", fill: "none", strokeWidth: 2 }}>
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <path d="M3 6h18" />
                    <path d="M3 12h18" />
                    <path d="M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Panel del menú móvil */}
      <div className={`mob-menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <div key={link.href}>
            <Link
              href={link.href}
              className={`mob-a${pathname === link.href ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
            {link.children && (
              <div className="mob-sub">
                {link.children.map((c) => (
                  <Link key={c.href} href={c.href} className="mob-sub-a" onClick={() => setMenuOpen(false)}>
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="mob-foot">
          <button
            className="mob-btn"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            Buscar
          </button>
          <Link
            href={isLoggedIn ? "/perfil" : "/login"}
            className="mob-btn"
            onClick={() => setMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            {isLoggedIn ? "Mi perfil" : "Ingresar"}
          </Link>
        </div>
      </div>

      {/* Search Modal */}
      <div className={`search-modal${searchOpen ? " open" : ""}`}>
        <button className="sm-close" onClick={() => setSearchOpen(false)}>
          <svg viewBox="0 0 24 24" style={{ width: 32, height: 32, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="sm-cnt">
          <h2 className="sm-title">Buscar Cafetería</h2>
          <form className="sm-form" onSubmit={handleSearch}>
            <input
              ref={searchInputRef}
              type="text"
              className="sm-input"
              placeholder="Escribe el nombre aquí..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="sm-hint">Presiona ENTER para buscar</span>
          </form>
        </div>
      </div>

      <VoteModal 
        open={voteModalOpen} 
        onClose={() => setVoteModalOpen(false)} 
      />
    </>
  );
}
