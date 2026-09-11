"use client";

import { useActionState } from "react";
import { enviarInteresComite } from "@/app/actions/comite";

/**
 * Invitación abierta a sumarse al Comité Nacional País. Vive en Academia,
 * junto a la alianza con el ITSE, porque es ahí donde se explica el trabajo
 * de formación que el comité acompaña.
 */
export default function ComiteForm() {
  const [state, formAction, pending] = useActionState(enviarInteresComite, null);

  return (
    <section className="comite" id="comite-nacional">
      <style>{`
        .comite{background:#38050e;border-radius:24px;padding:clamp(28px,4vw,48px);margin-bottom:48px;color:#f4efe4}
        .comite-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(205,219,242,.7);margin-bottom:10px}
        .comite h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(26px,3.8vw,40px);font-weight:900;text-transform:uppercase;color:#fff;line-height:1.02;margin:0 0 14px;text-wrap:balance;max-width:680px}
        .comite-p{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.7;color:rgba(244,239,228,.85);margin:0 0 26px;max-width:640px}
        .comite-form{display:grid;gap:16px;max-width:680px}
        .comite-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .comite-lbl{display:block;font-family:'Barlow',sans-serif;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(205,219,242,.75);margin-bottom:6px}
        .comite-inp{width:100%;height:48px;padding:0 14px;border:1px solid rgba(205,219,242,.28);border-radius:11px;background:rgba(0,0,0,.2);font-family:'Barlow',sans-serif;font-size:15px;color:#fff;outline:none;transition:border-color .2s,background .2s}
        textarea.comite-inp{height:auto;padding:12px 14px;resize:vertical;line-height:1.6}
        .comite-inp::placeholder{color:rgba(244,239,228,.4)}
        .comite-inp:focus{border-color:#cddbf2;background:rgba(0,0,0,.32)}
        .comite-btn{justify-self:start;height:52px;padding:0 34px;border:none;border-radius:50px;background:#cddbf2;color:#38050e;font-family:'Barlow',sans-serif;font-size:16px;font-weight:700;cursor:pointer;transition:background .2s,transform .2s}
        .comite-btn:hover:not(:disabled){background:#fff;transform:translateY(-2px)}
        .comite-btn:disabled{opacity:.55;cursor:not-allowed;transform:none}
        .comite-aviso{font-family:'Barlow',sans-serif;font-size:14.5px;line-height:1.6;border-radius:12px;padding:14px 16px}
        .comite-err{background:rgba(255,120,120,.14);border:1px solid rgba(255,140,140,.45);color:#ffd9d9}
        .comite-ok{background:rgba(205,219,242,.14);border:1px solid rgba(205,219,242,.45);color:#eaf1fb}
        .comite-ok-t{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;text-transform:uppercase;color:#fff;margin-bottom:6px}
        @media(max-width:680px){ .comite-grid2{grid-template-columns:1fr} }
        @media (prefers-reduced-motion: reduce){ .comite-btn:hover:not(:disabled){transform:none} }
      `}</style>

      <div className="comite-eye">Comité Nacional País</div>

      {state?.success ? (
        <div className="comite-aviso comite-ok">
          <div className="comite-ok-t">Mensaje enviado</div>
          <p style={{ margin: 0 }}>{state.success}</p>
        </div>
      ) : (
        <>
          <h2>¿Quieres ser parte del Comité Nacional País? Escríbenos</h2>
          <p className="comite-p">
            El Comité Nacional País reúne a quienes empujan la industria del café panameño —
            productores, tostadores, baristas, academia y empresas aliadas. Déjanos tus datos y
            te contamos cómo sumarte.
          </p>

          <form action={formAction} className="comite-form">
            <div className="comite-grid2">
              <div>
                <label className="comite-lbl" htmlFor="comite-nombre">Nombre completo</label>
                <input id="comite-nombre" name="nombre" required className="comite-inp" placeholder="Tu nombre y apellido" />
              </div>
              <div>
                <label className="comite-lbl" htmlFor="comite-email">Correo de contacto</label>
                <input id="comite-email" name="email" type="email" required className="comite-inp" placeholder="nombre@empresa.com" />
              </div>
            </div>

            <div className="comite-grid2">
              <div>
                <label className="comite-lbl" htmlFor="comite-area">Área de interés</label>
                <input id="comite-area" name="area" required className="comite-inp" placeholder="Ej: formación, tostado, producción" />
              </div>
              <div>
                <label className="comite-lbl" htmlFor="comite-empresa">Empresa que representa</label>
                <input id="comite-empresa" name="empresa" required className="comite-inp" placeholder="Nombre de la empresa" />
              </div>
            </div>

            <div>
              <label className="comite-lbl" htmlFor="comite-mensaje">Cuéntanos algo más (opcional)</label>
              <textarea id="comite-mensaje" name="mensaje" rows={3} className="comite-inp" placeholder="En qué te gustaría aportar" />
            </div>

            {state?.error && <div className="comite-aviso comite-err">{state.error}</div>}

            <button type="submit" className="comite-btn" disabled={pending}>
              {pending ? "Enviando…" : "Enviar mi interés"}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
