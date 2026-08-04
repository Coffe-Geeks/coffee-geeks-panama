"use client";

type Ally = {
  _id: string;
  name: string;
  logo: string;
  url?: string;
  isLightLogo?: boolean;
};

export default function AlliesSection({ allies }: { allies: Ally[] }) {
  if (!allies.length) return null;

  // El track se duplica para que el bucle no muestre nunca un hueco.
  // Con menos de 4 logos hacen falta más copias para llenar el ancho.
  const copies = allies.length >= 4 ? 2 : Math.ceil(8 / allies.length);
  const track = Array.from({ length: copies }, () => allies).flat();

  return (
    <section className="al-sec">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .al-sec{background:#fff;padding:64px 0 68px;overflow:hidden}
        .al-wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}
        .al-head{text-align:center;margin-bottom:34px}
        .al-eye-row{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:10px}
        .al-eye-line{height:1px;width:40px;background:#cddbf2}
        .al-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#38050e;opacity:.6}
        .al-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,4vw,42px);font-weight:900;text-transform:uppercase;color:#38050e;line-height:.92}
        .al-p{font-family:'Barlow',sans-serif;font-size:14px;line-height:1.6;color:#38050e;opacity:.7;max-width:560px;margin:10px auto 0}

        /* ── Carrusel ── */
        .al-view{position:relative;overflow:hidden}
        /* Difuminado en los bordes: los logos entran y salen sin cortarse en seco */
        .al-view::before,.al-view::after{content:'';position:absolute;top:0;bottom:0;width:80px;z-index:2;pointer-events:none}
        .al-view::before{left:0;background:linear-gradient(to right,#fff,rgba(255,255,255,0))}
        .al-view::after{right:0;background:linear-gradient(to left,#fff,rgba(255,255,255,0))}

        .al-track{display:flex;width:max-content;animation:al-run 32s linear infinite}
        .al-view:hover .al-track{animation-play-state:paused}

        /* 4 columnas visibles: cada celda ocupa un cuarto del contenedor */
        .al-item{flex:0 0 auto;width:calc(1160px / 4);display:flex;align-items:center;justify-content:center;padding:0 18px}

        /* Caja de altura fija + contain: alinea todos los logos por alto
           y base, y ninguno se estira sea cual sea su proporción */
        .al-box{width:100%;height:62px;display:flex;align-items:center;justify-content:center}
        .al-box img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block;
          /* Escala de grises: unifica logos de colores muy distintos */
          filter:grayscale(1);opacity:.62;transition:filter .3s ease,opacity .3s ease}
        .al-item:hover .al-box img{filter:grayscale(0);opacity:1}
        /* Los logos claros se invierten para que existan sobre el fondo blanco */
        .al-box.is-light img{filter:grayscale(1) invert(1);opacity:.62}
        .al-item:hover .al-box.is-light img{filter:invert(1);opacity:1}

        a.al-link{display:flex;width:100%;height:100%;align-items:center;justify-content:center;text-decoration:none}

        /* Un ciclo = la mitad del track, que es donde empieza la copia */
        @keyframes al-run{
          from{transform:translateX(-50%)}
          to{transform:translateX(0)}
        }

        @media(max-width:960px){
          .al-item{width:calc(100vw / 3)}
          .al-view::before,.al-view::after{width:48px}
        }
        @media(max-width:640px){
          .al-item{width:calc(100vw / 2)}
          .al-box{height:52px}
        }

        /* Quien pidió menos movimiento ve los logos quietos */
        @media (prefers-reduced-motion: reduce){
          .al-track{animation:none;flex-wrap:wrap;width:100%;justify-content:center}
          .al-item{width:25%;padding:14px 18px}
        }
      `}</style>

      <div className="al-wrap">
        <div className="al-head">
          <div className="al-eye-row">
            <div className="al-eye-line" />
            <span className="al-eye">Quienes nos acompañan</span>
            <div className="al-eye-line" />
          </div>
          <h2 className="al-h2">Nuestros Aliados</h2>
          <p className="al-p">
            El camino a la gran taza no se recorre solo. Estas son las marcas e
            instituciones que hacen posible Coffee Geeks Panamá.
          </p>
        </div>
      </div>

      <div className="al-view">
        <div className="al-track">
          {track.map((ally, i) => {
            const logo = (
              <div className={`al-box${ally.isLightLogo ? " is-light" : ""}`}>
                <img src={ally.logo} alt={ally.name} loading="lazy" draggable={false} />
              </div>
            );

            return (
              <div className="al-item" key={`${ally._id}-${i}`} aria-hidden={i >= allies.length}>
                {ally.url ? (
                  <a
                    className="al-link"
                    href={ally.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={ally.name}
                  >
                    {logo}
                  </a>
                ) : (
                  logo
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
