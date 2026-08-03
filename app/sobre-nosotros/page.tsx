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
          
          <div className="content-section">
            <h2 className="section-title">Quiénes Somos</h2>
            <p className="section-text">
              Somos la <strong>primera marca sectorial de café en Panamá</strong>. A través de nuestras plataformas digitales integramos, internacionalizamos, conectamos y fortalecemos todo el ecosistema del café panameño y su cadena de valor.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">Qué Hacemos</h2>
            <p className="section-text">
              Impulsamos a Panamá ante la industria global del café, integrando la hospitalidad, el turismo, gastronomía y sostenibilidad como ejes de desarrollo. Promovemos el consumo del café nacional y dignificamos el oficio del barista a través del reconocimiento y la educación certificada.
            </p>
            <p className="section-text">
              Conectamos a toda la cadena de valor, desde el productor hasta el consumidor para posicionar internacionalmente una industria cafetera panameña diversa, competitiva y alineada con los altos estándares del café de especialidad que hoy tiene el país y que demanda la industria global.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">Propósito</h2>
            <p className="section-text">
              Consolidar a Panamá como el <strong>hub de experiencias auténticas, sofisticadas y de alta calidad alrededor del café</strong>, a través de una propuesta que conecta la industria, el origen, la cultura y la excelencia con respaldo internacional e internacionalización de la industria de café panameña.
            </p>
            <p className="section-text">
              Coffee Geeks conecta el ecosistema cafetero local con la comunidad global de consumidores, y lo proyecta en los nichos más exclusivos junto a sus aliados estratégicos.
            </p>
            <p className="section-text">
              Contamos con un Pasaporte que cada año impulsa diferentes dinámicas que dan forma a la guía de referencia de las mejores experiencias alrededor del café de Panamá para el mundo.
            </p>
            <p className="section-text">
              El 2026 desarrollamos la primera curaduría de coffee shops, hoteles y restaurantes que ofrecen experiencias auténticas y únicas alrededor del café y que serán referencia para ser evaluadas y estar en la lista nacional <strong>The Best Coffee Shops Panamá (TBCS)</strong>, con la posibilidad de alcanzar <em>The World's 100 Best Coffee Shops</em> y los rankings continentales.
            </p>
            <p className="section-text">
              Acompáñanos en <strong>El Camino a la Gran Taza</strong>, el concurso experiencial y cultural que celebra la creatividad, el conocimiento y las experiencias detrás de cada taza panameña.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">Nuestra Red de Aliados</h2>
            <p className="section-text">
              Estos son los coffee shops, hoteles y restaurantes que ya forman parte del ecosistema Coffee Geeks y que serán referencia para ser elegibles en la lista nacional <strong>The Best Coffee Shops Panamá (TBCS)</strong>.
            </p>

            <h3 className="aliados-category">Coffee Shops exclusivos que sirven café panameño</h3>
            <ul className="aliados-list">
              <li>Kotowa Coffee House – Vía Israel</li>
              <li>Heritage by Kotowa Farms – Boquete</li>
              <li>Toño's Café Bakery – Costa del Este</li>
              <li>Toños Factory – Corozal</li>
              <li>Unido Coffee Roasters – Casco Viejo</li>
              <li>Momo Coffee House – Obarrio</li>
              <li>Weekend Coffee Roasters – Transístmica</li>
              <li>Sisu Coffee Studio – Calle Uruguay</li>
              <li>Tosto Coffee – Obarrio</li>
              <li>SIP Studio – Alta Plaza</li>
              <li>Leto Coffee – Obarrio</li>
              <li>Siete Granos – Casco Viejo</li>
              <li>Cabrera Road Coffee – Vía Argentina</li>
              <li>Foodbarn – Marbella</li>
              <li>Rebequet – Boquete</li>
            </ul>

            <h3 className="aliados-category">Hoteles que ofrecen experiencias alrededor del café</h3>
            <ul className="aliados-list">
              <li>Café Vera – Sofitel Legend Casco Viejo Panamá</li>
              <li>Hotel La Compañía (Coffee Shop)</li>
              <li>La Micaela Coffee Shop by Hotel Miramar Intercontinental</li>
              <li>Hotel Valle Escondido – Boquete</li>
              <li>Hotel Finca Lerida</li>
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
