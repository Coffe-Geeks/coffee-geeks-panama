import BotonAppStore from "./BotonAppStore";
import dbConnect from "@/lib/mongodb";
import StoreProduct from "@/models/StoreProduct";

/**
 * Banner de descarga del Coffee Geeks Passport.
 *
 * Vive donde la descarga es la acción que sigue: la página del pasaporte y la
 * portada. No se repite en todas las páginas a propósito — un banner que
 * aparece en todas partes deja de leerse a los dos minutos.
 *
 * La imagen sale del producto del pasaporte en la base y no va fijada aquí:
 * si mañana le cambian la foto en el panel, el banner la sigue sin que nadie
 * toque código. Si la consulta falla o el producto no tiene imagen, el bloque
 * simplemente no se dibuja y el banner queda a una sola columna.
 */
async function imagenDelPasaporte(): Promise<string> {
  try {
    await dbConnect();
    const producto = await StoreProduct.findOne({ activaPasaporte: true, isActive: true })
      .select("image")
      .sort({ updatedAt: -1 })
      .lean<{ image?: string }>();
    return producto?.image || "";
  } catch (err) {
    console.error("Banner de la app: no se pudo leer la imagen del producto:", err);
    return "";
  }
}

export default async function BannerApp() {
  const imagen = await imagenDelPasaporte();

  return (
    <section className="banner-app" aria-labelledby="banner-app-titulo">
      <style>{`
        .banner-app{position:relative;overflow:hidden;background:#cddbf2;border-radius:24px;padding:clamp(28px,4vw,44px);color:#38050e}
        .banner-app::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 100% at 88% 0%,rgba(255,255,255,.55) 0%,transparent 58%);pointer-events:none}
        .banner-app-int{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:clamp(24px,4vw,48px);flex-wrap:wrap}
        .banner-app-txt{flex:1;min-width:260px}
        .banner-app-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(56,5,14,.6);margin-bottom:10px}
        .banner-app h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(26px,3.8vw,40px);font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.02;margin:0 0 12px;text-wrap:balance}
        .banner-app p{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.7;color:rgba(56,5,14,.8);margin:0 0 24px;max-width:460px}
        .banner-app-pasos{display:flex;gap:22px;flex-wrap:wrap;margin-bottom:26px}
        .banner-app-paso{font-family:'Barlow',sans-serif;font-size:13.5px;line-height:1.5;color:rgba(56,5,14,.7);display:flex;align-items:baseline;gap:8px}
        .banner-app-num{font-family:'Barlow Condensed',sans-serif;font-size:19px;font-weight:900;color:#38050e}
        .banner-app-nota{font-family:'Barlow',sans-serif;font-size:12.5px;color:rgba(56,5,14,.55);margin-top:14px}
        .banner-app-foto{flex-shrink:0;width:clamp(180px,24vw,260px);max-width:100%;border-radius:20px;overflow:hidden;box-shadow:0 18px 40px rgba(56,5,14,.22);background:#f4efe4}
        .banner-app-foto img{display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover}
        @media(max-width:720px){ .banner-app-foto{width:100%;max-width:320px;margin:0 auto} }
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

          <BotonAppStore variante="oscuro" />

          <div className="banner-app-nota">
            Disponible para iPhone. La versión para Android llega pronto.
          </div>
        </div>

        {imagen && (
          <div className="banner-app-foto">
            <img src={imagen} alt="Pasaporte Turístico del Café" loading="lazy" />
          </div>
        )}
      </div>
    </section>
  );
}
