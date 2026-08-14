import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import AplicaFlotante from "./AplicaFlotante";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nuestro Método | Coffee Geeks Panamá",
  description:
    "Modelo basado en confianza, experiencia y origen, con respaldo metodológico y auditoría independiente de iTRUST Consumer Brands y Trusted Origin.",
};

const HERRAMIENTAS = [
  {
    letra: "A",
    icono: "☕",
    titulo: "Insignia Panamá Coffee Geeks",
    lema: "Identifica y distingue",
    cuerpo:
      "Identifica la excelencia de la experiencia cafetera. La insignia Coffee Geeks reconoce a los establecimientos y profesionales que forman parte de la iniciativa, conforme a los criterios y reglamento establecidos por Country Brand Foundation.",
    listaTitulo: "Requisitos para ser miembro de CGP",
    lista: ["Fomentar el consumo del café panameño.", "Promover la educación certificada."],
  },
  {
    letra: "B",
    icono: "🏅",
    titulo: "iTRUST Consumer Brands",
    lema: "Audita y certifica",
    cuerpo:
      "Los establecimientos participantes que opten a este reconocimiento son evaluados mediante el Modelo iTRUST Consumer Brands, a través de auditorías, mediciones y verificaciones independientes. La Fundación determina, de acuerdo con su metodología, si el establecimiento alcanza el nivel de excelencia requerido y, cuando corresponde, emite el reconocimiento:",
    lista: [
      "Marca de Confianza en Experiencia de Cliente, o",
      "Establecimiento de Confianza en Experiencia de Cliente.",
    ],
  },
  {
    letra: "C",
    icono: "🌱",
    titulo: "Trusted Origin",
    lema: "Certifica el origen",
    cuerpo:
      "Certificación para el café de origen. De manera independiente, la Fundación desarrolla Trusted Origin, un programa dirigido a productores y fincas cafetaleras. Mediante su propia metodología, evalúa y certifica el cumplimiento de requisitos relacionados con el origen confiable del café.",
    nota: "Este programa es independiente de Coffee Geeks y de iTRUST Consumer Brands.",
  },
];

const DIMENSIONES = [
  "Imagen del establecimiento y del equipo de atención.",
  "Reputación percibida.",
  "Satisfacción con el servicio, el producto y la experiencia global.",
  "Confianza generada durante la experiencia de consumo.",
  "Calidad percibida de la atención y del producto.",
  "Experiencia general del cliente.",
  "Compromiso o vinculación emocional con el establecimiento.",
  "Intención de recompra o de volver a visitar el establecimiento.",
  "Intención de recomendación a terceros.",
];

const OBTIENE = [
  "Exhibir el sello Coffee Geeks.",
  "Exhibir el sello iTRUST Consumer Brands — Establecimiento de Confianza en Experiencia de Cliente.",
  "Comunicar públicamente que han superado una evaluación independiente de experiencia de cliente.",
  "Reforzar su reputación mediante un reconocimiento basado en evidencias objetivas.",
  "Diferenciarse en el mercado mediante un distintivo internacional de confianza.",
];

const PILARES = [
  {
    nombre: "Confianza",
    texto:
      "Evaluamos y reconocemos establecimientos que ofrecen experiencias confiables y consistentes al consumidor.",
  },
  {
    nombre: "Experiencia",
    texto:
      "Ponemos en valor la calidad de la experiencia que reciben consumidores, profesionales y visitantes en los establecimientos vinculados al café.",
  },
  {
    nombre: "Origen",
    texto:
      "Reconocemos la importancia del origen y promovemos la identificación del café producido por fincas cafetaleras aliadas bajo criterios de origen confiable.",
  },
];

export default function NuestroMetodoPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500;600&display=swap');

        .ph{position:relative;padding-top:58px}
        .ph-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.62}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.62) 0%,rgba(0,0,0,.48) 45%,rgba(0,0,0,.72) 100%)}
        .ph-cnt{position:relative;z-index:2;padding:44px 0}
        .ph-flex{display:flex;align-items:center;justify-content:space-between;gap:40px}
        .ph-txt{flex:1}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,6vw,64px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92;margin-bottom:4px}
        .ph-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(22px,3vw,32px);font-weight:400;text-transform:uppercase;color:rgba(196,212,232,.55)}
        .ph-logo{width:clamp(120px,18vw,220px);height:auto;filter:drop-shadow(0 10px 30px rgba(0,0,0,0.3));animation:float 6s ease-in-out infinite}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:#38050e;opacity:.7;text-decoration:none;transition:opacity .2s}
        .bread-i a:hover{opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}
        .sec{padding:56px 0}
        .sec-claro{background:#fff}
        .sec-crema{background:#f4efe4}
        .sec-oscuro{background:#38050e}

        .eye-row{display:flex;align-items:center;gap:14px;margin-bottom:12px}
        .eye-row.centro{justify-content:center}
        .eye-line{height:1px;width:40px;background:#cddbf2}
        .eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#38050e;opacity:.6}
        .sec-oscuro .eye{color:rgba(205,219,242,.75);opacity:1}
        .sec-oscuro .eye-line{background:rgba(205,219,242,.4)}

        .h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,4.2vw,44px);font-weight:900;text-transform:uppercase;color:#38050e;line-height:.95;margin-bottom:14px}
        .sec-oscuro .h2{color:#fff}
        .h2.centro{text-align:center}
        .p{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.72;color:#38050e;opacity:.85;margin-bottom:14px}
        .p:last-child{margin-bottom:0}
        .p strong{font-weight:600;opacity:1}
        .sec-oscuro .p{color:rgba(255,255,255,.85)}
        .p.centro{text-align:center;max-width:760px;margin-left:auto;margin-right:auto}

        /* ── Las tres herramientas ── */
        .herr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:32px}
        .herr{background:#fff;border:1px solid #cddbf2;border-radius:18px;padding:24px 22px;display:flex;flex-direction:column}
        .herr-top{display:flex;align-items:center;gap:12px;margin-bottom:12px}
        .herr-letra{width:34px;height:34px;flex-shrink:0;border-radius:50px;background:#38050e;color:#cddbf2;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:1.15rem;font-weight:900}
        .herr-icono{font-size:1.5rem;line-height:1}
        .herr-t{font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05;margin-bottom:3px}
        .herr-lema{font-family:'Barlow',sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#38050e;opacity:.55;margin-bottom:12px}
        .herr-p{font-family:'Barlow',sans-serif;font-size:14.5px;line-height:1.65;color:#38050e;opacity:.8;margin-bottom:12px}
        .herr-lt{font-family:'Barlow',sans-serif;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#38050e;opacity:.6;margin-bottom:6px}
        .herr-ul{list-style:none;padding:0;margin:0 0 auto;display:flex;flex-direction:column;gap:7px}
        .herr-ul li{position:relative;padding-left:18px;font-family:'Barlow',sans-serif;font-size:14px;line-height:1.55;color:#38050e;opacity:.82}
        .herr-ul li::before{content:'';position:absolute;left:0;top:8px;width:7px;height:7px;border-radius:50px;background:#cddbf2;border:1px solid rgba(56,5,14,.25)}
        .herr-ol{list-style:none;counter-reset:r;padding:0;margin:0 0 auto;display:flex;flex-direction:column;gap:7px}
        .herr-ol li{counter-increment:r;position:relative;padding-left:24px;font-family:'Barlow',sans-serif;font-size:14px;line-height:1.55;color:#38050e;opacity:.82}
        .herr-ol li::before{content:counter(r) ".";position:absolute;left:0;top:0;font-family:'Barlow Condensed',sans-serif;font-size:.95rem;font-weight:900;color:#38050e;opacity:.5}
        .herr-nota{margin-top:14px;padding-top:12px;border-top:1px solid #cddbf2;font-family:'Barlow',sans-serif;font-size:12.5px;line-height:1.5;color:#38050e;opacity:.6;font-style:italic}

        .lema-tres{font-family:'Barlow Condensed',sans-serif;font-size:clamp(20px,2.8vw,30px);font-weight:900;text-transform:uppercase;color:#38050e;text-align:center;line-height:1.15;margin-top:34px}
        .lema-tres span{color:#8AAFD4}

        /* ── Pilares ── */
        .pil-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:30px}
        .pil{background:rgba(255,255,255,.06);border:1px solid rgba(205,219,242,.22);border-radius:18px;padding:24px 22px}
        .pil-n{font-family:'Barlow Condensed',sans-serif;font-size:1.7rem;font-weight:900;text-transform:uppercase;color:#cddbf2;line-height:1;margin-bottom:9px}
        .pil-p{font-family:'Barlow',sans-serif;font-size:14.5px;line-height:1.65;color:rgba(255,255,255,.8)}
        .formula{font-family:'Barlow Condensed',sans-serif;font-size:clamp(22px,3.4vw,38px);font-weight:900;text-transform:uppercase;color:#cddbf2;text-align:center;margin-top:32px;letter-spacing:.02em}

        /* ── Bloques con lista numerada ── */
        .blq{background:#fff;border:1px solid #cddbf2;border-radius:18px;padding:26px 26px;margin-top:18px}
        .blq-t{font-family:'Barlow Condensed',sans-serif;font-size:1.6rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05;margin-bottom:12px}
        .ol{list-style:none;counter-reset:n;padding:0;margin:14px 0 0;display:grid;gap:9px}
        .ol li{counter-increment:n;position:relative;padding-left:38px;font-family:'Barlow',sans-serif;font-size:15px;line-height:1.6;color:#38050e;opacity:.85}
        .ol li::before{content:counter(n,decimal-leading-zero);position:absolute;left:0;top:0;font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:900;color:#cddbf2}

        .cita{background:#38050e;border-radius:18px;padding:28px 30px;margin-top:22px}
        .cita p{font-family:'Barlow Condensed',sans-serif;font-size:clamp(19px,2.4vw,26px);font-weight:400;font-style:italic;line-height:1.35;color:#fff;margin:0}
        .cita p + p{margin-top:12px}

        .flujo{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;margin-top:26px}
        .flujo-i{background:#f4efe4;border:1px solid #cddbf2;border-radius:50px;padding:10px 20px;font-family:'Barlow Condensed',sans-serif;font-size:1.05rem;font-weight:900;text-transform:uppercase;color:#38050e}
        .flujo-f{color:#8AAFD4;font-size:1.3rem;line-height:1}

        .cta-fund{display:flex;justify-content:center;margin-top:30px}
        .cta-fund a{display:inline-flex;align-items:center;gap:9px;height:46px;padding:0 26px;border-radius:50px;background:#cddbf2;color:#38050e;font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;text-decoration:none;transition:all .2s;text-align:center}
        .cta-fund a:hover{background:#8AAFD4;color:#fff}

        @media(max-width:960px){.herr-grid,.pil-grid{grid-template-columns:1fr}}
        @media(max-width:768px){
          .ph-flex{flex-direction:column;align-items:flex-start;gap:25px}
          .ph-logo{width:140px}
          .sec{padding:44px 0}
          .blq{padding:20px 18px}
        }
      `}</style>

      <Navbar />

      {/* Hero */}
      <div className="ph">
        <div className="ph-bg" style={{ backgroundImage: "url('/banner-metodo.webp')" }} />
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-flex">
              <div className="ph-txt">
                <div className="ph-eye">Confianza · Experiencia · Origen</div>
                <h1 className="ph-h1">Nuestro Método</h1>
                <h2 className="ph-h2">Cómo reconocemos la excelencia</h2>
              </div>
              <div className="ph-side">
                <img src="/concurso.webp" alt="Coffee Geeks Panamá" className="ph-logo" />
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
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <Link href="/sobre-nosotros">Sobre Nosotros</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span>Nuestro Método</span>
          </div>
        </div>
      </div>

      {/* Modelo */}
      <section className="sec sec-claro">
        <div className="wrap">
          <div className="eye-row">
            <div className="eye-line" />
            <span className="eye">El modelo</span>
          </div>
          <h2 className="h2">Modelo basado en confianza, experiencia y origen</h2>
          <p className="p">
            Nuestra iniciativa cuenta con el respaldo metodológico y la auditoría independiente del
            <strong> Modelo iTRUST Consumer Brands</strong>, que evalúa científicamente la experiencia
            de cliente ofrecida por los establecimientos participantes. Los establecimientos que
            alcancen los estándares establecidos podrán obtener, además de la Insignia de Excelencia,
            el reconocimiento iTRUST Consumer Brands como Establecimiento de Confianza en Experiencia
            al Cliente.
          </p>
          <p className="p">
            A este modelo se suma <strong>Trusted Origin</strong>, orientado a certificar el Origen
            Confiable del café producido por las fincas cafetaleras aliadas.
          </p>
        </div>
      </section>

      {/* Acuerdos de colaboración */}
      <section className="sec sec-crema">
        <div className="wrap">
          <div className="eye-row">
            <div className="eye-line" />
            <span className="eye">Acuerdos de colaboración</span>
          </div>
          <h2 className="h2">Country Brand Foundation</h2>
          <p className="p">
            A través de nuestra marca aliada <strong>Panama Unique</strong>, especializada en las
            experiencias alrededor de los productos de origen, y en colaboración con la
            <strong> Fundación Marca País / Country Brand Foundation</strong>, ampliamos nuestra
            capacidad para identificar y facilitar certificaciones que evalúan la excelencia del
            sector y los productos asociados al café panameño.
          </p>
          <div className="blq">
            <div className="blq-t">Esta colaboración permite</div>
            <ol className="ol">
              <li>Identificar y reconocer establecimientos, productos y servicios que cumplen con estándares de excelencia y confianza.</li>
              <li>Potenciar las iniciativas que reconocen y ponen en valor a quienes ofrecen experiencias excepcionales y diversas.</li>
              <li>Incorporar metodologías científicas de evaluación y certificación relacionadas con la confianza, la experiencia del cliente y el origen confiable a través del Country Brand Foundation.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Las tres herramientas */}
      <section className="sec sec-claro">
        <div className="wrap">
          <div className="eye-row centro">
            <div className="eye-line" />
            <span className="eye">Tres herramientas</span>
            <div className="eye-line" />
          </div>
          <h2 className="h2 centro">Cada sello, su propósito</h2>

          <div className="herr-grid">
            {HERRAMIENTAS.map((h) => (
              <article className="herr" key={h.letra}>
                <div className="herr-top">
                  <span className="herr-letra">{h.letra}</span>
                  <span className="herr-icono">{h.icono}</span>
                </div>
                <h3 className="herr-t">{h.titulo}</h3>
                <div className="herr-lema">{h.lema}</div>
                <p className="herr-p">{h.cuerpo}</p>
                {h.lista && (
                  <>
                    {h.listaTitulo && <div className="herr-lt">{h.listaTitulo}</div>}
                    {h.listaTitulo ? (
                      <ol className="herr-ol">
                        {h.lista.map((i) => <li key={i}>{i}</li>)}
                      </ol>
                    ) : (
                      <ul className="herr-ul">
                        {h.lista.map((i) => <li key={i}>{i}</li>)}
                      </ul>
                    )}
                  </>
                )}
                {h.nota && <div className="herr-nota">{h.nota}</div>}
              </article>
            ))}
          </div>

          <p className="lema-tres">
            Tres herramientas. Tres propósitos.<br />
            <span>Una visión: elevar la excelencia de la industria del café panameño, desde el origen hasta la experiencia del consumidor.</span>
          </p>

          <div className="cta-fund">
            <a href="https://panamaunique.com" target="_blank" rel="noopener noreferrer">
              Conoce más de nuestra colaboración con Country Brand Foundation
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Cómo se relacionan */}
      <section className="sec sec-crema">
        <div className="wrap">
          <div className="eye-row">
            <div className="eye-line" />
            <span className="eye">Cómo se relacionan</span>
          </div>
          <h2 className="h2">Dos sellos, responsabilidades distintas</h2>
          <p className="p">
            Un establecimiento que supere satisfactoriamente la evaluación técnica de iTRUST podrá
            contar con ambos distintivos: <strong>Coffee Geeks Panamá + iTRUST Consumer Brands</strong>.
            Cada sello mantiene su propia naturaleza, criterios y responsabilidad.
          </p>
          <div className="flujo">
            <span className="flujo-i">Coffee Geeks identifica</span>
            <span className="flujo-f">→</span>
            <span className="flujo-i">La Fundación evalúa y certifica</span>
          </div>
          <p className="p centro" style={{ marginTop: 22 }}>
            Generando mayor confianza para consumidores, profesionales, empresas y visitantes
            internacionales.
          </p>
        </div>
      </section>

      {/* Modelo de excelencia */}
      <section className="sec sec-oscuro">
        <div className="wrap">
          <div className="eye-row centro">
            <div className="eye-line" />
            <span className="eye">Qué impulsamos</span>
            <div className="eye-line" />
          </div>
          <h2 className="h2 centro">Modelo de excelencia</h2>
          <p className="p centro">Nuestro modelo integra tres dimensiones fundamentales.</p>

          <div className="pil-grid">
            {PILARES.map((p) => (
              <div className="pil" key={p.nombre}>
                <div className="pil-n">{p.nombre}</div>
                <p className="pil-p">{p.texto}</p>
              </div>
            ))}
          </div>

          <div className="formula">Confianza + Experiencia + Origen</div>
          <p className="p centro" style={{ marginTop: 12 }}>
            Una visión integral para elevar el estándar de la industria cafetera panameña.
          </p>
        </div>
      </section>

      {/* Insignia y Trusted Origin */}
      <section className="sec sec-claro">
        <div className="wrap">
          <div className="blq">
            <div className="blq-t">Insignia de excelencia</div>
            <p className="p">
              Los que alcancen los estándares establecidos podrán obtener una Insignia de Excelencia,
              como reconocimiento a la calidad de la experiencia que ofrecen. Esta insignia se
              complementa con el reconocimiento <strong>iTRUST Consumer Brands</strong> como
              Establecimiento de Confianza en Experiencia al Cliente, respaldado por un modelo de
              evaluación científica y auditoría independiente.
            </p>
          </div>
          <div className="blq">
            <div className="blq-t">Trusted Origin</div>
            <p className="p">
              Trusted Origin se incorpora al modelo como una herramienta orientada a certificar el
              Origen Confiable del café producido por las fincas cafetaleras aliadas. De esta manera,
              el modelo conecta el origen con la experiencia final que recibe el consumidor.
            </p>
            <p className="p">
              Desde la finca hasta la taza, buscamos fortalecer la confianza, la trazabilidad y el
              valor de los productos de origen panameño.
            </p>
          </div>
        </div>
      </section>

      {/* Qué aporta y qué evalúa la Fundación */}
      <section className="sec sec-crema">
        <div className="wrap">
          <div className="eye-row">
            <div className="eye-line" />
            <span className="eye">La evaluación</span>
          </div>
          <h2 className="h2">¿Qué aporta la Fundación?</h2>
          <p className="p">
            La Fundación participa como entidad independiente responsable de la evaluación técnica de
            la experiencia de cliente, mediante la aplicación del Modelo iTRUST. Su función consiste
            en auditar objetivamente la experiencia ofrecida por los establecimientos participantes,
            utilizando una metodología propia basada en indicadores verificables de calidad, confianza
            y satisfacción del cliente. Aquellos establecimientos que alcancen los niveles exigidos
            podrán obtener el reconocimiento <strong>iTRUST Consumer Brands — Establecimiento de
            Confianza en Experiencia de Cliente</strong>, acreditando así el cumplimiento de
            estándares internacionales de excelencia.
          </p>

          <div className="cita">
            <p>“La confianza no es una opinión; es el resultado de una experiencia consistente, medible y verificable.”</p>
            <p>“No medimos únicamente la satisfacción. Evaluamos los factores que convierten una buena experiencia en confianza, y la confianza en valor para la marca.”</p>
          </div>

          <div className="blq">
            <div className="blq-t">¿Qué evalúa iTRUST?</div>
            <p className="p">
              El modelo analiza de forma estructurada las principales dimensiones que configuran la
              percepción del consumidor y contribuyen al fortalecimiento del valor de marca, entre
              las que se incluyen:
            </p>
            <ol className="ol">
              {DIMENSIONES.map((d) => <li key={d}>{d}</li>)}
            </ol>
            <p className="p" style={{ marginTop: 16 }}>
              Estas dimensiones son evaluadas mediante indicadores objetivos y la percepción de
              consumidores reales, lo que permite obtener una visión integral de la experiencia
              ofrecida por cada establecimiento y de su capacidad para generar confianza y
              diferenciación competitiva.
            </p>
          </div>

          <div className="blq">
            <div className="blq-t">¿Qué obtiene el establecimiento?</div>
            <p className="p">Los establecimientos que superen el proceso de evaluación podrán:</p>
            <ol className="ol">
              {OBTIENE.map((o) => <li key={o}>{o}</li>)}
            </ol>
            <p className="p" style={{ marginTop: 16 }}>
              La obtención de cualquiera de estos reconocimientos dependerá exclusivamente del
              resultado de la evaluación realizada por la Fundación, que actuará con plena
              independencia técnica y metodológica.
            </p>
          </div>
        </div>
      </section>

      <AplicaFlotante />
      <Footer />
    </>
  );
}
