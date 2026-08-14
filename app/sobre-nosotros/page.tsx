import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function SobreNosotrosPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500;700&display=swap');

        .ph{position:relative;padding-top:58px}
        .ph-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.18}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,#38050e 0%,rgba(56,5,14,.7) 100%)}
        .ph-cnt{position:relative;z-index:2;padding:44px 0 44px}
        .ph-flex{display:flex;align-items:center;justify-content:space-between;gap:40px}
        .ph-txt{flex:1}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(205,219,242,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,6vw,64px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92;margin-bottom:4px}
        .ph-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(22px,3vw,32px);font-weight:400;text-transform:uppercase;color:rgba(205,219,242,.55)}
        .ph-logo{width:clamp(120px,18vw,220px);height:auto;filter:drop-shadow(0 10px 30px rgba(0,0,0,0.3));animation:float 6s ease-in-out infinite}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        
        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:#857375;transition:color .2s;text-decoration:none}
        .bread-i a:hover{color:#38050e}
        .bread-i span{color:#22191A;opacity:.6}

        .main-page{padding:64px 0;background:#f4efe4;min-height:400px}
        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}

        /* Typography for content */
        .content-section { margin-bottom: 48px; }
        .section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 900;
          text-transform: uppercase;
          color: #22191A;
          line-height: .92;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-title::after {
          content: "";
          flex: 1;
          height: 2px;
          background: rgba(56, 5, 14, 0.1);
          margin-top: 4px;
        }
        .section-text {
          font-family: 'Barlow', sans-serif;
          font-size: 16px;
          color: #524345;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .section-text strong {
          color: #38050e;
        }

        /* List styles */
        .aliados-category {
          margin-top: 32px;
          margin-bottom: 16px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #38050e;
          text-transform: uppercase;
        }
        .aliados-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 12px;
        }
        .aliados-list li {
          font-family: 'Barlow', sans-serif;
          font-size: 15px;
          color: #524345;
          padding: 12px 16px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          display: flex;
          align-items: center;
          gap: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .aliados-list li:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
        }
        .aliados-list li::before {
          content: "";
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #38050e;
          flex-shrink: 0;
        }


        /* ── Puntos principales: número grande + título ── */
        .pt{margin-bottom:52px}
        .pt:last-child{margin-bottom:0}
        .pt-head{display:flex;align-items:baseline;gap:16px;margin-bottom:14px;padding-bottom:12px;border-bottom:2px solid #cddbf2}
        .pt-num{font-family:'Barlow Condensed',sans-serif;font-size:clamp(40px,6vw,64px);font-weight:900;line-height:.8;color:#cddbf2;flex-shrink:0}
        .pt-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,4.4vw,46px);font-weight:900;text-transform:uppercase;color:#38050e;line-height:.95;margin:0}
        .pt-body{padding-left:clamp(0px,4vw,54px)}
        .pt-p{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.72;color:#38050e;opacity:.85;margin-bottom:14px}
        .pt-p:last-child{margin-bottom:0}
        .pt-p strong{font-weight:600;opacity:1}
        .pt-claim{font-family:'Barlow Condensed',sans-serif;font-size:clamp(22px,3vw,30px);font-weight:900;text-transform:uppercase;color:#38050e;letter-spacing:.01em;margin-top:6px}

        /* ── Subpuntos: deliberadamente menores que los puntos ── */
        .sub{background:#fff;border:1px solid #cddbf2;border-left:4px solid #38050e;border-radius:12px;padding:16px 18px;margin-bottom:12px}
        .sub:last-child{margin-bottom:0}
        .sub-t{font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:700;text-transform:uppercase;color:#38050e;line-height:1.12;margin:0 0 6px}
        .sub-p{font-family:'Barlow',sans-serif;font-size:15px;line-height:1.65;color:#38050e;opacity:.8;margin:0}

        /* ── Valores de la visión ── */
        .valores{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 18px;padding:0}
        .valores li{font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;color:#38050e;background:#fff;border:1px solid #cddbf2;padding:7px 15px;border-radius:50px}

        @media(max-width:640px){
          .pt-head{gap:12px}
          .pt-body{padding-left:0}
        }

        @media(max-width:768px){
          .ph-flex{flex-direction:column;align-items:flex-start;gap:25px}
          .ph-logo{width:140px}
          .aliados-list { grid-template-columns: 1fr; }
        }
      `}</style>

      <Navbar />

      {/* Page Hero */}
      <div className="ph">
        <div className="ph-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1800&q=75')" }} />
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-flex">
              <div className="ph-txt">
                <div className="ph-eye">Nuestra Historia</div>
                <h1 className="ph-h1">Sobre Nosotros</h1>
                <h2 className="ph-h2">La esencia del café de Panamá</h2>
              </div>
              <div className="ph-side">
                <img src="/concurso.webp" alt="Concurso Logo" className="ph-logo" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/home">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#857375", fill: "none", strokeWidth: 2 }}><polyline points="9 18 15 12 9 6" /></svg>
            <span>Sobre Nosotros</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="main-page">
        <div className="wrap">

          {/* 1 */}
          <section className="pt">
            <div className="pt-head">
              <span className="pt-num">01</span>
              <h2 className="pt-title">Quiénes somos</h2>
            </div>
            <div className="pt-body">
              <p className="pt-p">
                Somos la <strong>primera marca sectorial especializada en café en Panamá</strong>,
                creada para internacionalizar y generar valor a todo el ecosistema del café
                panameño y su cadena de valor.
              </p>
              <p className="pt-p">
                Trabajamos con la industria nacional potenciando la alta calidad de sus productos
                de origen, impulsando el conocimiento, el talento y las experiencias que hacen
                única la industria alrededor de sus productos de origen nacional.
              </p>
              <p className="pt-claim">De Panamá para el mundo.</p>
            </div>
          </section>

          {/* 2 */}
          <section className="pt">
            <div className="pt-head">
              <span className="pt-num">02</span>
              <h2 className="pt-title">¿Qué hacemos?</h2>
            </div>
            <div className="pt-body">
              <p className="pt-p">
                Impulsamos la cadena de valor ante la industria global, integrando
                <strong> educación, hospitalidad, turismo, gastronomía y sostenibilidad</strong> como
                ejes estratégicos para la evolución de la industria.
              </p>
            </div>
          </section>

          {/* 3 */}
          <section className="pt">
            <div className="pt-head">
              <span className="pt-num">03</span>
              <h2 className="pt-title">¿Cómo lo hacemos?</h2>
            </div>
            <div className="pt-body">
              <div className="sub">
                <h3 className="sub-t">Impulsamos el conocimiento, el consumo y la profesionalización</h3>
                <p className="sub-p">
                  Fomentamos el consumo de café nacional, reconocemos y ponemos en valor el oficio
                  del barista y promovemos la educación certificada para productores, baristas y
                  consumidores, contribuyendo así al crecimiento y profesionalización de la
                  industria local.
                </p>
              </div>
              <div className="sub">
                <h3 className="sub-t">Identificamos y reconocemos la excelencia</h3>
                <p className="sub-p">
                  Desarrollamos iniciativas que permiten identificar, reconocer y visibilizar la
                  excelencia de establecimientos, productos y servicios vinculados al café,
                  generando nuevas oportunidades para quienes forman parte de este ecosistema.
                </p>
              </div>
            </div>
          </section>

          {/* 4 */}
          <section className="pt">
            <div className="pt-head">
              <span className="pt-num">04</span>
              <h2 className="pt-title">Objetivo</h2>
            </div>
            <div className="pt-body">
              <p className="pt-p">
                Posicionar internacionalmente la industria cafetera panameña: diversa, competitiva
                y alineada con los altos estándares del mercado global y del café de especialidad,
                y los productos asociados.
              </p>
            </div>
          </section>

          {/* 5 */}
          <section className="pt">
            <div className="pt-head">
              <span className="pt-num">05</span>
              <h2 className="pt-title">Propósito</h2>
            </div>
            <div className="pt-body">
              <p className="pt-p">
                Consolidar a Panamá como el <strong>hub de experiencias auténticas, sofisticadas y
                de alta calidad alrededor del café</strong>, a través de una propuesta única e
                innovadora, resaltando el origen, la cultura y la excelencia con respaldo
                internacional.
              </p>
            </div>
          </section>

          {/* 6 */}
          <section className="pt">
            <div className="pt-head">
              <span className="pt-num">06</span>
              <h2 className="pt-title">Visión</h2>
            </div>
            <div className="pt-body">
              <p className="pt-p">
                Construir una industria cafetera panameña cada vez más conectada, profesional,
                competitiva y reconocida internacionalmente. Una industria donde el valor no esté
                únicamente en el producto, sino también en:
              </p>
              <ul className="valores">
                {[
                  "El origen", "El conocimiento", "El talento", "La hospitalidad",
                  "La gastronomía", "El turismo", "La sostenibilidad", "La experiencia",
                  "La confianza", "La excelencia",
                ].map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              <p className="pt-p">
                Coffee Geeks trabaja para conectar todos estos elementos y generar nuevas
                oportunidades para quienes forman parte del ecosistema del café panameño.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
