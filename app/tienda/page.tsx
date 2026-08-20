import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default async function TiendaPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .ph{position:relative;padding-top:58px;background:linear-gradient(135deg,#4a0a15 0%,#38050e 55%,#24060c 100%)}
        .ph-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.62}
        .ph-sc{position:absolute;inset:0;background:radial-gradient(120% 100% at 80% 0%,rgba(120,20,40,.35) 0%,transparent 55%)}
        .ph-sello{position:absolute;right:clamp(20px,5vw,60px);top:72px;width:84px;height:84px;opacity:.55;animation:spin3 28s linear infinite}
        @keyframes spin3{to{transform:rotate(360deg)}}
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

        .main-page{padding:44px 0 64px;background:#f4efe4;min-height:400px}
        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}
        .eyebrow-row{display:flex;align-items:center;gap:9px;margin-bottom:6px;justify-content:center}
        .eyebrow-line{width:24px;height:2px;background:#38050e;flex-shrink:0}
        .eyebrow-text{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#38050e}
        @media(max-width:768px){
          .ph-flex{flex-direction:column;align-items:flex-start;gap:25px}
          .ph-logo{width:140px}
        }
      `}</style>

      <Navbar />

      {/* Page Hero */}
      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-flex">
              <div className="ph-txt">
                <div className="ph-eye">Exclusividad en cada grano</div>
                <h1 className="ph-h1">Tienda</h1>
                <h2 className="ph-h2">Productos para Coffee Geeks</h2>
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
            <Link href="/">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#857375", fill: "none", strokeWidth: 2 }}><polyline points="9 18 15 12 9 6" /></svg>
            <span>Tienda</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="main-page">
        <div className="wrap">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="eyebrow-row">
              <div className="eyebrow-line" />
              <span className="eyebrow-text">Lo mejor del café a tu alcance</span>
              <div className="eyebrow-line" />
            </div>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, textTransform: "uppercase", color: "#22191A", lineHeight: ".92" }}>Catálogo de Productos</h2>
            <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 700, textTransform: "uppercase", color: "#524345", marginTop: 2 }}>Próximamente disponibles</h3>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#524345", marginTop: 6, maxWidth: "600px", margin: "6px auto 0" }}>
              Estamos seleccionando los mejores granos, accesorios y mercancía oficial para que disfrutes la experiencia Coffee Geeks en casa.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
