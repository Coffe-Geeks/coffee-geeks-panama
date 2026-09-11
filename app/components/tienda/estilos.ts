/**
 * Estilos compartidos del flujo de compra (carrito, checkout, pago y
 * confirmación). Se escriben una sola vez porque las cuatro pantallas son
 * la misma secuencia: cambiar el marrón en un lado y no en otro rompería la
 * sensación de estar en un mismo proceso.
 *
 * Se mantiene la convención de las demás páginas del sitio: CSS plano en un
 * <style> junto al componente, con los mismos nombres de clase (ph, bread,
 * wrap) que ya usan tienda y participantes.
 */
export const estilosTienda = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

.ph{position:relative;padding-top:58px;background:linear-gradient(135deg,#4a0a15 0%,#38050e 55%,#24060c 100%)}
.ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.62) 0%,rgba(0,0,0,.48) 45%,rgba(0,0,0,.72) 100%)}
.ph-cnt{position:relative;z-index:2;padding:44px 0}
.ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
.ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,6vw,64px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92;margin:0}
.ph-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(18px,2.5vw,26px);font-weight:400;text-transform:uppercase;color:rgba(196,212,232,.55);margin:6px 0 0}

.bread{background:#fff;border-bottom:1px solid #eee}
.bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px;flex-wrap:wrap}
.bread-i a{color:#38050e;opacity:.7;transition:opacity .2s;text-decoration:none}
.bread-i a:hover{opacity:1}
.bread-i span{color:#38050e;opacity:.6}

.wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}
.sec-claro{background:#f4efe4;padding:48px 0 72px;min-height:52vh}
.sec-blanco{background:#fff;padding:48px 0 72px;min-height:52vh}

/* ── Pasos ── */
.pasos{display:flex;align-items:center;gap:10px;margin-bottom:28px;font-family:'Barlow',sans-serif;font-size:12px;flex-wrap:wrap}
.paso{display:inline-flex;align-items:center;gap:8px;color:#38050e;opacity:.45}
.paso.activo{opacity:1;font-weight:500}
.paso-num{width:22px;height:22px;border-radius:50px;background:#38050e;color:#f4efe4;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:13px}
.paso-sep{width:22px;height:1px;background:#38050e;opacity:.25}

/* ── Layout de compra ── */
.compra-grid{display:grid;grid-template-columns:1fr 380px;gap:32px;align-items:start}

/* ── Líneas del carrito ── */
.lineas{display:flex;flex-direction:column;gap:14px}
.linea{display:grid;grid-template-columns:96px 1fr auto;gap:18px;align-items:center;background:#fff;border:1px solid #cddbf2;border-radius:18px;padding:16px}
.linea-img{width:96px;aspect-ratio:1;border-radius:12px;background-size:cover;background-position:center;background-color:#38050e;display:flex;align-items:center;justify-content:center;padding:8px;text-align:center}
.linea-img-txt{font-family:'Barlow',sans-serif;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:rgba(205,219,242,.75);line-height:1.3}
.linea-datos{min-width:0}
.linea-nombre{font-family:'Barlow Condensed',sans-serif;font-size:1.4rem;font-weight:900;text-transform:uppercase;color:#38050e;line-height:1.05;text-decoration:none;display:block}
.linea-nombre:hover{opacity:.7}
.linea-var{font-family:'Barlow',sans-serif;font-size:13px;color:#38050e;opacity:.62;margin-top:3px}
.linea-precio{font-family:'Barlow',sans-serif;font-size:13px;color:#38050e;opacity:.75;margin-top:6px}
.linea-acciones{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.linea-total{font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:900;color:#38050e;line-height:1;font-variant-numeric:tabular-nums}

.cant{display:inline-flex;align-items:center;border:1px solid #cddbf2;border-radius:50px;overflow:hidden;background:#f4efe4}
.cant button{width:34px;height:34px;border:none;background:transparent;color:#38050e;font-size:17px;font-family:'Barlow',sans-serif;cursor:pointer;transition:background .15s}
.cant button:hover{background:#cddbf2}
.cant span{min-width:34px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:16px;color:#38050e;font-variant-numeric:tabular-nums}

.quitar{background:none;border:none;padding:0;font-family:'Barlow',sans-serif;font-size:12px;color:#38050e;opacity:.55;cursor:pointer;text-decoration:underline;transition:opacity .15s}
.quitar:hover{opacity:1}

/* ── Resumen ── */
.resumen{background:#fff;border:1px solid #cddbf2;border-radius:22px;padding:26px;position:sticky;top:76px}
.resumen-h{font-family:'Barlow Condensed',sans-serif;font-size:1.7rem;font-weight:900;text-transform:uppercase;color:#38050e;margin:0 0 18px}
.fila{display:flex;justify-content:space-between;align-items:baseline;gap:16px;font-family:'Barlow',sans-serif;font-size:15px;color:#38050e;padding:9px 0;border-bottom:1px solid #f4efe4;font-variant-numeric:tabular-nums}
.fila-total{border-bottom:none;border-top:2px solid #38050e;margin-top:8px;padding-top:16px;font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:900;text-transform:uppercase}
.aviso{font-family:'Barlow',sans-serif;font-size:13px;line-height:1.5;color:#38050e;background:#f4efe4;border-left:3px solid #38050e;padding:11px 14px;margin:14px 0 0}

.btn-primario{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:54px;margin-top:20px;background:#38050e;color:#fff;font-family:'Barlow',sans-serif;font-weight:700;font-size:16px;border-radius:50px;border:none;cursor:pointer;text-decoration:none;transition:background .2s,transform .2s,box-shadow .2s;box-shadow:0 4px 14px rgba(56,5,14,.18)}
.btn-primario:hover{background:#24060c;transform:translateY(-2px);box-shadow:0 6px 20px rgba(56,5,14,.25)}
.btn-primario:disabled{opacity:.55;cursor:not-allowed;transform:none;box-shadow:none}
.enlace-secundario{display:block;text-align:center;margin-top:14px;font-family:'Barlow',sans-serif;font-size:14px;color:#38050e;opacity:.7;text-decoration:underline}
.enlace-secundario:hover{opacity:1}

/* ── Formulario ── */
.tarjeta{background:#fff;border:1px solid #cddbf2;border-radius:22px;padding:28px;margin-bottom:18px}
.tarjeta-h{font-family:'Barlow Condensed',sans-serif;font-size:1.6rem;font-weight:900;text-transform:uppercase;color:#38050e;margin:0 0 4px}
.tarjeta-p{font-family:'Barlow',sans-serif;font-size:14px;line-height:1.55;color:#38050e;opacity:.7;margin:0 0 22px}
.campos{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.campo{display:flex;flex-direction:column;gap:6px}
.campo.ancho{grid-column:1 / -1}
.campo label{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#38050e;opacity:.65}
.campo input,.campo textarea,.campo select{font-family:'Barlow',sans-serif;font-size:15px;color:#38050e;background:#f4efe4;border:1px solid #cddbf2;border-radius:12px;padding:13px 15px;width:100%;transition:border-color .15s,box-shadow .15s}
.campo input:focus,.campo textarea:focus,.campo select:focus{outline:none;border-color:#38050e;box-shadow:0 0 0 3px rgba(56,5,14,.1)}
.campo textarea{resize:vertical;min-height:88px}

.error{font-family:'Barlow',sans-serif;font-size:14px;line-height:1.5;color:#8a1220;background:#fdecee;border:1px solid #f3c9ce;border-radius:12px;padding:13px 16px;margin-bottom:18px}

/* ── Aceptación de términos antes de pagar ── */
.acepto{display:flex;gap:10px;align-items:flex-start;margin-top:18px;cursor:pointer}
.acepto input{width:18px;height:18px;margin:2px 0 0;flex-shrink:0;accent-color:#38050e;cursor:pointer}
.acepto span{font-family:'Barlow',sans-serif;font-size:13px;line-height:1.5;color:#38050e;opacity:.8}
.acepto a{color:#38050e;text-decoration:underline;text-underline-offset:2px}
.acepto a:hover{opacity:.7}

/* ── Estados vacíos y mensajes ── */
.vacio{text-align:center;padding:70px 20px;font-family:'Barlow',sans-serif;color:#38050e}
.vacio-h{font-family:'Barlow Condensed',sans-serif;font-size:2rem;font-weight:900;text-transform:uppercase;margin:0 0 8px}
.vacio-p{font-size:15px;opacity:.7;margin:0}

@media(max-width:960px){
  .compra-grid{grid-template-columns:1fr}
  .resumen{position:static}
}
@media(max-width:640px){
  .linea{grid-template-columns:72px 1fr;gap:14px}
  .linea-img{width:72px}
  .linea-acciones{grid-column:1 / -1;flex-direction:row;align-items:center;justify-content:space-between;width:100%}
  .campos{grid-template-columns:1fr}
}
@media (prefers-reduced-motion: reduce){
  .btn-primario:hover{transform:none}
}
`;
