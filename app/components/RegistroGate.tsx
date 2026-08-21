"use client";

import { useEffect, useState } from "react";
import PrivacyCheckbox from "@/app/components/PrivacyCheckbox";

/**
 * Puerta de entrada del sitio: pide nombre, correo y teléfono (opcional)
 * antes de dejar ver el contenido. El layout solo la monta cuando el
 * visitante no tiene la cookie de registro ni sesión iniciada, así que
 * aquí no hay que comprobar nada: si está montada, se muestra.
 */
export default function RegistroGate() {
  const [hidden, setHidden] = useState(false); // true tras registrarse
  const [closing, setClosing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Mientras la puerta esté visible, la página de atrás no hace scroll
  useEffect(() => {
    if (hidden) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [hidden]);

  if (hidden) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) {
      setErrorMsg("Debes aceptar las políticas de privacidad.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.error || "No pudimos guardar tu registro. Intenta de nuevo.");
        setLoading(false);
        return;
      }
      // Registrado: la cookie ya quedó puesta; se despide con un fundido
      setClosing(true);
      setTimeout(() => setHidden(true), 350);
    } catch {
      setErrorMsg("No hay conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .rg-ov{position:fixed;inset:0;z-index:900;background:rgba(56,5,14,.82);backdrop-filter:blur(9px);display:flex;align-items:center;justify-content:center;padding:18px;opacity:1;transition:opacity .35s;overflow-y:auto}
        .rg-ov.closing{opacity:0;pointer-events:none}
        .rg-card{background:#fff;border-radius:28px;width:100%;max-width:480px;overflow:hidden;box-shadow:0 24px 60px rgba(56,5,14,.35);margin:auto}
        .rg-hd{background:#38050e;padding:26px 28px 20px;text-align:center}
        .rg-logo{height:52px;margin:0 auto 10px;display:block}
        .rg-t{font-family:'Barlow Condensed',sans-serif;font-size:1.55rem;font-weight:900;text-transform:uppercase;color:#fff;line-height:1.1}
        .rg-s{font-size:13px;color:rgba(255,255,255,.55);margin-top:6px;font-family:'Barlow',sans-serif}
        .rg-body{padding:22px 28px 26px;display:flex;flex-direction:column;gap:12px}
        .rg-lbl{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:rgba(56,5,14,.6);font-family:'Barlow',sans-serif;margin-bottom:4px;display:block}
        .rg-inp{width:100%;padding:12px 16px;border-radius:12px;background:#cddbf2;border:1px solid rgba(205,219,242,.1);color:#38050e;font-size:15px;outline:none;transition:box-shadow .2s}
        .rg-inp::placeholder{color:rgba(56,5,14,.45)}
        .rg-inp:focus{box-shadow:0 0 0 2px rgba(56,5,14,.35)}
        .rg-btn{margin-top:6px;width:100%;padding:14px;border:none;border-radius:12px;background:#38050e;color:#fff;font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:.9rem;cursor:pointer;transition:opacity .2s}
        .rg-btn:hover{opacity:.92}
        .rg-btn:disabled{opacity:.35;cursor:default}
        .rg-err{background:#fee2e2;color:#dc2626;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:600;text-align:center;border:1px solid #fecaca}
        .rg-note{font-size:11px;color:rgba(56,5,14,.45);text-align:center;font-family:'Barlow',sans-serif}
        @media(max-width:520px){
          .rg-card{border-radius:20px}
          .rg-hd{padding:20px 20px 16px}
          .rg-body{padding:18px 20px 22px}
        }
      `}</style>

      <div className={`rg-ov${closing ? " closing" : ""}`} role="dialog" aria-modal="true" aria-label="Registro">
        <div className="rg-card">
          <div className="rg-hd">
            <img src="/logo.webp" alt="Coffee Geeks Panamá" className="rg-logo" />
            <div className="rg-t">El Camino a la Gran Taza</div>
            <div className="rg-s">Regístrate para descubrir lo mejor del café panameño</div>
          </div>

          <form className="rg-body" onSubmit={handleSubmit}>
            <div>
              <label className="rg-lbl" htmlFor="rg-name">Nombre y apellido</label>
              <input
                id="rg-name"
                className="rg-inp"
                type="text"
                placeholder="Ej: Juan Pérez"
                value={name}
                required
                autoComplete="name"
                // Solo letras y espacios: se filtran guiones, números y símbolos
                onChange={(e) => setName(e.target.value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]/g, ""))}
              />
            </div>

            <div>
              <label className="rg-lbl" htmlFor="rg-email">Correo electrónico</label>
              <input
                id="rg-email"
                className="rg-inp"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                required
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="rg-lbl" htmlFor="rg-phone">Teléfono (opcional)</label>
              <input
                id="rg-phone"
                className="rg-inp"
                type="tel"
                inputMode="numeric"
                placeholder="Ej: 60000000"
                value={phone}
                autoComplete="tel-national"
                maxLength={15}
                // Solo dígitos: sin guiones, espacios ni caracteres
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <PrivacyCheckbox
              checked={privacyAccepted}
              onChange={setPrivacyAccepted}
              accentColor="#38050e"
              textColor="rgba(56,5,14,.6)"
            />

            {errorMsg && <div className="rg-err">{errorMsg}</div>}

            <button className="rg-btn" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Entrar al sitio"}
            </button>

            <p className="rg-note">Usaremos tus datos solo para contarte del proyecto y sus novedades.</p>
          </form>
        </div>
      </div>
    </>
  );
}
