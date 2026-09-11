"use client";

import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";

/**
 * Guía del Consumidor: cómo se vota en el Camino a la Gran Taza.
 *
 * El texto viene de la organización. Lo que aporta esta página es el orden:
 * primero quién puede votar, luego qué se califica, y al final —destacado—
 * la advertencia de que la nota del barista no mueve el resultado. Esa
 * aclaración es la que evita reclamos después del cierre, así que no puede
 * quedar enterrada entre el resto.
 */
export default function GuiaConsumidorClient() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500;700&display=swap');

        .ph{position:relative;padding-top:58px;background:linear-gradient(135deg,#4a0a15 0%,#38050e 55%,#24060c 100%)}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.62) 0%,rgba(0,0,0,.48) 45%,rgba(0,0,0,.72) 100%)}
        .ph-cnt{position:relative;z-index:2;padding:56px 0 50px}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,6vw,68px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.9;margin:0;max-width:900px;text-wrap:balance}
        .ph-by{display:block;font-size:.42em;font-weight:400;line-height:1.2;color:rgba(205,219,242,.82);margin-top:16px;letter-spacing:.02em;max-width:720px}

        .bread{background:#fff;border-bottom:1px solid #eee}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px;flex-wrap:wrap}
        .bread-i a{color:#38050e;opacity:.7;text-decoration:none;transition:opacity .2s}
        .bread-i a:hover{opacity:1}
        .bread-i span{color:#38050e;opacity:.6}

        .wrap{width:100%;max-width:900px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}
        .sec{background:#f4efe4;padding:52px 0 72px}

        .bloque{background:#fff;border:1px solid #cddbf2;border-radius:20px;padding:clamp(24px,4vw,38px);margin-bottom:22px}
        .bloque h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(24px,3.4vw,34px);font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.02;margin:0 0 6px}
        .bloque h3{font-family:'Barlow Condensed',sans-serif;font-size:19px;font-weight:900;text-transform:uppercase;color:#38050e;margin:24px 0 10px}
        .bloque p{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.7;color:#38050e;opacity:.85;margin:0 0 14px}
        .bloque p:last-child{margin-bottom:0}

        .lista{list-style:none;padding:0;margin:0}
        .lista li{position:relative;padding:11px 0 11px 28px;font-family:'Barlow',sans-serif;font-size:16px;line-height:1.6;color:#38050e;border-bottom:1px solid #f4efe4}
        .lista li:last-child{border-bottom:none}
        .lista li::before{content:"";position:absolute;left:4px;top:19px;width:7px;height:7px;border-radius:50%;background:#38050e;opacity:.45}
        .lista strong{font-weight:700}

        /* Escala de calificación */
        .escala{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}
        .escala div{background:#f4efe4;border-radius:14px;padding:16px;text-align:center}
        .escala b{display:block;font-family:'Barlow Condensed',sans-serif;font-size:34px;font-weight:900;color:#38050e;line-height:1}
        .escala span{display:block;margin-top:4px;font-family:'Barlow',sans-serif;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#38050e;opacity:.7}

        /* La advertencia que no puede pasar desapercibida */
        .ojo{background:#38050e;border-radius:20px;padding:clamp(24px,4vw,38px);margin-bottom:22px;color:#f4efe4}
        .ojo h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(24px,3.4vw,34px);font-weight:900;text-transform:uppercase;color:#fff;line-height:1.02;margin:0 0 12px}
        .ojo p{font-family:'Barlow',sans-serif;font-size:16px;line-height:1.7;margin:0 0 12px;color:rgba(244,239,228,.9)}
        .ojo p:last-child{margin-bottom:0}
        .ojo b{color:#cddbf2}

        .fechas{display:flex;flex-wrap:wrap;gap:12px;margin-top:18px}
        .fecha{flex:1;min-width:200px;background:#f4efe4;border-left:3px solid #38050e;padding:16px 18px}
        .fecha span{display:block;font-family:'Barlow',sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#38050e;opacity:.6;margin-bottom:4px}
        .fecha b{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;color:#38050e;line-height:1.1}

        /* Preguntas frecuentes */
        .faq{width:100%;border-collapse:collapse;margin-top:8px}
        .faq td{font-family:'Barlow',sans-serif;font-size:15px;line-height:1.55;color:#38050e;padding:14px 0;border-bottom:1px solid #f4efe4;vertical-align:top}
        .faq td:first-child{font-weight:500;padding-right:24px;width:52%}
        .faq tr:last-child td{border-bottom:none}

        .cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;height:54px;padding:0 32px;margin-top:8px;background:#38050e;color:#fff;font-family:'Barlow',sans-serif;font-weight:700;font-size:16px;border-radius:50px;text-decoration:none;box-shadow:0 4px 14px rgba(56,5,14,.18);transition:background .2s,transform .2s}
        .cta:hover{background:#24060c;transform:translateY(-2px)}

        @media(max-width:640px){
          .escala{grid-template-columns:1fr}
          .faq td{display:block;width:100%;padding:6px 0}
          .faq td:first-child{padding-top:14px;border-bottom:none}
          .faq td:last-child{padding-bottom:14px;opacity:.8}
        }
        @media (prefers-reduced-motion: reduce){ .cta:hover{transform:none} }
      `}</style>

      <Navbar />

      <div className="ph">
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-eye">El Concurso · Guía del Consumidor</div>
            <h1 className="ph-h1">
              Cómo votar
              <span className="ph-by">
                en el Camino a la Gran Taza, primera Curaduría Nacional de las Experiencias
                alrededor del café de Panamá.
              </span>
            </h1>
          </div>
        </div>
      </div>

      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/">Inicio</Link>
            <Flecha />
            <span>El Concurso</span>
            <Flecha />
            <span>Guía del Consumidor</span>
          </div>
        </div>
      </div>

      <section className="sec">
        <div className="wrap">

          <div className="bloque">
            <h2>Quién puede votar</h2>
            <p>El público general vota por tres cosas:</p>
            <ul className="lista">
              <li>
                <strong>La experiencia integral</strong> del coffee shop u hotel participante —
                servicio, ambiente y conexión.
              </li>
              <li><strong>Su barista favorito.</strong></li>
              <li>
                <strong>Su bebida favorita</strong>, entre filtrado, espresso y signature drink.
              </li>
            </ul>
          </div>

          <div className="bloque">
            <h2>Requisitos para votar</h2>
            <ul className="lista">
              <li>
                <strong>Debes tener sesión iniciada.</strong> No se aceptan votos anónimos.
              </li>
              <li>
                <strong>Un voto por coffee shop u hotel.</strong> El sistema no permite votar dos
                veces por el mismo establecimiento en la misma ronda, aunque se intente repetir.
              </li>
              <li>
                Puedes votar por las <strong>tres categorías de bebida</strong> — filtrado,
                espresso y signature drink.
              </li>
              <li>
                Solo puedes votar por <strong>un barista favorito</strong>.
              </li>
            </ul>
          </div>

          <div className="bloque">
            <h2>Qué calificas</h2>
            <p>Como público, tu voto tiene tres partes, y cada una se califica del 1 al 5:</p>
            <ul className="lista">
              <li>
                <strong>Experiencia integral</strong> del coffee shop u hotel.
              </li>
              <li>
                <strong>Barista favorito</strong>, con tu calificación.
              </li>
              <li>
                <strong>Bebida favorita</strong>, eligiendo entre espresso, filtrado o signature.
              </li>
            </ul>

            <h3>La escala</h3>
            <div className="escala">
              <div><b>1</b><span>Normal</span></div>
              <div><b>3</b><span>Excelente</span></div>
              <div><b>5</b><span>Excepcional</span></div>
            </div>
          </div>

          <div className="ojo">
            <h2>Cómo se usa tu voto</h2>
            <p>
              Aquí hay un punto importante para tener expectativas claras: <b>tu calificación
              numérica del barista no afecta el ranking final</b>.
            </p>
            <p>
              Lo que sí cuenta para el resultado es <b>cuántos votos recibió cada cafetería</b>,
              comparado con la cafetería más votada.
            </p>
          </div>

          <div className="bloque">
            <h2>Fechas clave</h2>
            <div className="fechas">
              <div className="fecha">
                <span>Inicia</span>
                <b>20 de septiembre de 2026</b>
              </div>
              <div className="fecha">
                <span>Cierra</span>
                <b>20 de octubre de 2026</b>
              </div>
            </div>
          </div>

          <div className="bloque">
            <h2>Preguntas frecuentes</h2>
            <table className="faq">
              <tbody>
                <tr>
                  <td>¿Cuándo voto?</td>
                  <td>Solo en la Ronda 2, y solo si el voto popular está habilitado.</td>
                </tr>
                <tr>
                  <td>¿Por quién voto?</td>
                  <td>Solo por cafeterías finalistas.</td>
                </tr>
                <tr>
                  <td>¿Puedo votar más de una vez por la misma cafetería?</td>
                  <td>No.</td>
                </tr>
                <tr>
                  <td>¿Mi calificación del barista cambia el resultado?</td>
                  <td>No: solo cuenta el número de votos.</td>
                </tr>
                <tr>
                  <td>¿Hasta cuándo puedo votar?</td>
                  <td>Hasta el 20 de octubre de 2026.</td>
                </tr>
              </tbody>
            </table>

            <p style={{ marginTop: 24 }}>
              <Link href="/votaciones" className="cta">Ir a votar</Link>
            </p>
          </div>

        </div>
      </section>
    </>
  );
}

function Flecha() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "#38050e", opacity: 0.5, fill: "none", strokeWidth: 2 }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
