import BotonAppStore from "./BotonAppStore";

/**
 * Banner de descarga del Coffee Geeks Passport.
 *
 * Vive donde la descarga es la acción que sigue: la página del pasaporte y la
 * portada. No se repite en todas las páginas a propósito — un banner que
 * aparece en todas partes deja de leerse a los dos minutos.
 */
export default function BannerApp() {
  return (
    <section className="banner-app" aria-labelledby="banner-app-titulo">
      <style>{`
        .banner-app{position:relative;overflow:hidden;background:linear-gradient(135deg,#4a0a15 0%,#38050e 55%,#24060c 100%);border-radius:24px;padding:clamp(28px,4vw,44px);color:#f4efe4}
        .banner-app::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 100% at 85% 0%,rgba(205,219,242,.18) 0%,transparent 55%);pointer-events:none}
        .banner-app-int{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:clamp(24px,4vw,48px);flex-wrap:wrap}
        .banner-app-txt{flex:1;min-width:260px}
        .banner-app-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(205,219,242,.75);margin-bottom:10px}
        .banner-app h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(26px,3.8vw,40px);font-weight:900;text-transform:uppercase;color:#fff;line-height:1.02;margin:0 0 12px;text-wrap:balance}
        .banner-app p{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.7;color:rgba(244,239,228,.85);margin:0 0 24px;max-width:460px}
        .banner-app-pasos{display:flex;gap:22px;flex-wrap:wrap;margin-bottom:26px}
        .banner-app-paso{font-family:'Barlow',sans-serif;font-size:13.5px;line-height:1.5;color:rgba(244,239,228,.7);display:flex;align-items:baseline;gap:8px}
        .banner-app-num{font-family:'Barlow Condensed',sans-serif;font-size:19px;font-weight:900;color:#cddbf2}
        .banner-app-nota{font-family:'Barlow',sans-serif;font-size:12.5px;color:rgba(244,239,228,.55);margin-top:14px}
        .banner-app-arte{flex-shrink:0;width:clamp(150px,20vw,210px);aspect-ratio:9/16;max-width:100%;border-radius:22px;border:1px solid rgba(205,219,242,.28);background:linear-gradient(160deg,rgba(205,219,242,.16),rgba(205,219,242,.04));display:flex;align-items:center;justify-content:center}
        .banner-app-sello{width:58%;aspect-ratio:1;border-radius:50%;border:2px dashed rgba(205,219,242,.5);display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:rgba(205,219,242,.8);line-height:1.25;padding:10px}
        @media(max-width:720px){ .banner-app-arte{display:none} }
      `}</style>

      <div className="banner-app-int">
        <div className="banner-app-txt">
          <div className="banner-app-eye">Coffee Geeks Passport</div>
          <h2 id="banner-app-titulo">Lleva tu pasaporte del café en el bolsillo</h2>
          <p>
            Sella cada visita desde el teléfono, sigue tu recorrido por las cafeterías
            participantes y desbloquea los beneficios de la ruta.
          </p>

          <div className="banner-app-pasos">
            <div className="banner-app-paso"><span className="banner-app-num">1</span> Compra tu pasaporte</div>
            <div className="banner-app-paso"><span className="banner-app-num">2</span> Descarga la app</div>
            <div className="banner-app-paso"><span className="banner-app-num">3</span> Sella en cada barra</div>
          </div>

          <BotonAppStore variante="claro" />

          <div className="banner-app-nota">
            Disponible para iPhone. La versión para Android llega pronto.
          </div>
        </div>

        <div className="banner-app-arte" aria-hidden="true">
          <div className="banner-app-sello">Ruta<br />del<br />Café</div>
        </div>
      </div>
    </section>
  );
}
