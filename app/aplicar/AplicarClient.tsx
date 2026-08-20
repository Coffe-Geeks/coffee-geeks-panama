"use client";

import { useActionState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import { enviarAplicacion } from "@/app/actions/aplicacion";

const SELLOS = [
  { id: "coffeegeeks", icono: "☕", nombre: "Insignia Panamá Coffee Geeks", lema: "Identifica y distingue" },
  { id: "itrust", icono: "🏅", nombre: "iTRUST Consumer Brands", lema: "Audita y certifica la experiencia" },
  { id: "trustedorigin", icono: "🌱", nombre: "Trusted Origin", lema: "Certifica el origen del café" },
];

export default function AplicarClient() {
  const [state, formAction, pending] = useActionState(enviarAplicacion, null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500;600&display=swap');

        .ph{position:relative;padding-top:58px;background:linear-gradient(135deg,#4a0a15 0%,#38050e 55%,#24060c 100%)}
        .ph-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.62}
        .ph-sc{position:absolute;inset:0;background:radial-gradient(120% 100% at 80% 0%,rgba(120,20,40,.35) 0%,transparent 55%)}
        .ph-cnt{position:relative;z-index:2;padding:44px 0}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(34px,5.4vw,58px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.94;margin-bottom:4px}
        .ph-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(20px,2.8vw,30px);font-weight:400;text-transform:uppercase;color:rgba(196,212,232,.55)}

        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:#38050e;opacity:.7;text-decoration:none}
        .bread-i a:hover{opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        .wrap{width:100%;max-width:820px;margin:0 auto;padding:0 clamp(20px,5vw,40px)}
        .sec{background:#f4efe4;padding:48px 0 72px}

        .intro{font-family:'Barlow',sans-serif;font-size:15.5px;line-height:1.7;color:#38050e;opacity:.85;margin-bottom:26px}

        .card{background:#fff;border:1px solid #cddbf2;border-radius:18px;padding:26px 26px}
        .lbl{display:block;font-family:'Barlow',sans-serif;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#38050e;opacity:.65;margin-bottom:6px}
        .inp{width:100%;height:46px;padding:0 14px;border:1px solid #cddbf2;border-radius:11px;background:#f4efe4;font-family:'Barlow',sans-serif;font-size:15px;color:#38050e;outline:none;transition:border-color .2s,background .2s}
        textarea.inp{height:auto;padding:12px 14px;resize:vertical;line-height:1.6}
        .inp:focus{border-color:#38050e;background:#fff}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .campo{margin-bottom:16px}

        .sellos{display:grid;gap:10px;margin-bottom:6px}
        .sello{display:flex;align-items:flex-start;gap:12px;border:1px solid #cddbf2;border-radius:13px;padding:13px 15px;cursor:pointer;transition:all .18s;background:#f4efe4}
        .sello:hover{border-color:#38050e}
        .sello input{margin-top:3px;width:17px;height:17px;accent-color:#38050e;flex-shrink:0;cursor:pointer}
        .sello-ico{font-size:1.25rem;line-height:1.1}
        .sello-n{font-family:'Barlow Condensed',sans-serif;font-size:1.15rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.1}
        .sello-l{font-family:'Barlow',sans-serif;font-size:12.5px;color:#38050e;opacity:.6;margin-top:1px}

        .btn{width:100%;height:52px;margin-top:8px;border:none;border-radius:50px;background:#38050e;color:#cddbf2;font-family:'Barlow',sans-serif;font-size:16px;font-weight:500;cursor:pointer;transition:all .2s}
        .btn:hover:not(:disabled){background:#cddbf2;color:#38050e}
        .btn:disabled{opacity:.6;cursor:not-allowed}

        .aviso{border-radius:13px;padding:14px 16px;font-family:'Barlow',sans-serif;font-size:14.5px;line-height:1.6;margin-bottom:18px}
        .aviso-err{background:#fdecec;border:1px solid #e9b4b4;color:#8f2020}
        .ok{background:#fff;border:1px solid #cddbf2;border-radius:18px;padding:34px 30px;text-align:center}
        .ok-ico{width:64px;height:64px;margin:0 auto 16px;border-radius:50px;background:#cddbf2;display:flex;align-items:center;justify-content:center}
        .ok-t{font-family:'Barlow Condensed',sans-serif;font-size:1.9rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05;margin-bottom:10px}
        .ok-p{font-family:'Barlow',sans-serif;font-size:15px;line-height:1.7;color:#38050e;opacity:.8;margin-bottom:22px}
        .ok-b{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 24px;border-radius:50px;background:#38050e;color:#cddbf2;font-family:'Barlow',sans-serif;font-size:14px;text-decoration:none;transition:all .2s}
        .ok-b:hover{background:#cddbf2;color:#38050e}

        .nota{font-family:'Barlow',sans-serif;font-size:12.5px;line-height:1.6;color:#38050e;opacity:.55;margin-top:14px;text-align:center}

        @media(max-width:640px){.grid2{grid-template-columns:1fr}.card{padding:20px 18px}}
      `}</style>

      <Navbar />

      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-eye">Sellos de excelencia</div>
            <h1 className="ph-h1">Aplica ya</h1>
            <h2 className="ph-h2">Postula tu establecimiento</h2>
          </div>
        </div>
      </div>

      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <Link href="/nuestro-metodo">Nuestro Método</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span>Aplicar</span>
          </div>
        </div>
      </div>

      <main className="sec">
        <div className="wrap">
          {state?.success ? (
            <div className="ok">
              <div className="ok-ico">
                <svg viewBox="0 0 24 24" style={{ width: 30, height: 30, stroke: "#38050e", fill: "none", strokeWidth: 2 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="ok-t">Solicitud enviada</div>
              <p className="ok-p">{state.success}</p>
              <Link href="/nuestro-metodo" className="ok-b">Volver a Nuestro Método</Link>
            </div>
          ) : (
            <>
              <p className="intro">
                Completa este formulario para postular tu establecimiento. El equipo de Coffee Geeks
                Panamá se pondrá en contacto contigo para explicarte el proceso. La obtención de
                cualquiera de los reconocimientos depende del resultado de la evaluación realizada
                por la Fundación, que actúa con plena independencia técnica y metodológica.
              </p>

              {state?.error && <div className="aviso aviso-err">{state.error}</div>}

              <form action={formAction} className="card">
                <div className="campo">
                  <label className="lbl">Nombre del establecimiento *</label>
                  <input name="negocio" required className="inp" placeholder="Ej: Kotowa Coffee House" />
                </div>

                <div className="grid2">
                  <div className="campo">
                    <label className="lbl">Persona de contacto *</label>
                    <input name="contacto" required className="inp" />
                  </div>
                  <div className="campo">
                    <label className="lbl">Correo electrónico *</label>
                    <input name="email" type="email" required className="inp" placeholder="tucorreo@ejemplo.com" />
                  </div>
                  <div className="campo">
                    <label className="lbl">Teléfono</label>
                    <input name="telefono" className="inp" placeholder="+507 6000 0000" />
                  </div>
                  <div className="campo">
                    <label className="lbl">Tipo de establecimiento</label>
                    <select name="tipo" className="inp" defaultValue="Coffee shop">
                      <option>Coffee shop</option>
                      <option>Hotel</option>
                      <option>Restaurante</option>
                      <option>Finca cafetalera</option>
                      <option>Tostador</option>
                      <option>Otro</option>
                    </select>
                  </div>
                </div>

                <div className="campo">
                  <label className="lbl">Ubicación</label>
                  <input name="ubicacion" className="inp" placeholder="Ciudad, provincia" />
                </div>

                <div className="campo">
                  <label className="lbl">¿A qué sellos quieres aplicar? *</label>
                  <div className="sellos">
                    {SELLOS.map((s) => (
                      <label className="sello" key={s.id}>
                        <input type="checkbox" name="sellos" value={s.id} />
                        <span className="sello-ico">{s.icono}</span>
                        <span>
                          <span className="sello-n">{s.nombre}</span>
                          <span className="sello-l">{s.lema}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="campo">
                  <label className="lbl">Cuéntanos sobre tu establecimiento</label>
                  <textarea name="mensaje" rows={5} className="inp" placeholder="Qué café sirven, desde cuándo operan, qué experiencia ofrecen..." />
                </div>

                <button type="submit" disabled={pending} className="btn">
                  {pending ? "Enviando..." : "Enviar solicitud"}
                </button>

                <p className="nota">
                  Los campos marcados con * son obligatorios. Tus datos se usan únicamente para
                  gestionar esta solicitud.
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}
