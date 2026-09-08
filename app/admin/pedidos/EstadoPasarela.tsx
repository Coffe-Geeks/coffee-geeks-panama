/**
 * Diagnóstico de configuración de pagos.
 *
 * Dice qué variables están puestas en el entorno donde corre la aplicación,
 * **sin mostrar ningún valor secreto**: solo si existe o falta. Sirve para
 * responder "¿ya quedó el .env?" en producción o en pruebas sin entrar por
 * SSH ni abrir el panel de Vercel.
 *
 * Es un componente de servidor: process.env nunca llega al navegador.
 */

function Señal({ ok, texto, aviso }: { ok: boolean; texto: string; aviso?: boolean }) {
  const color = aviso
    ? "text-amber-300 bg-amber-500/10 border-amber-500/25"
    : ok
    ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/25"
    : "text-red-300 bg-red-500/10 border-red-500/25";
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${color}`}>
      <span>{aviso ? "▲" : ok ? "✓" : "✕"}</span>
      <span>{texto}</span>
    </div>
  );
}

export default function EstadoPasarela() {
  const hay = (n: string) => Boolean(process.env[n]);

  const credenciales = hay("POWERTRANZ_ID") && hay("POWERTRANZ_PASSWORD");
  const paginas = hay("POWERTRANZ_PAGE_SET") && hay("POWERTRANZ_PAGE_NAME");
  const pasarelaLista = credenciales && paginas;

  const base = process.env.POWERTRANZ_BASE_URL || "";
  const enStaging = base.includes("staging");
  const antifraude = process.env.POWERTRANZ_FRAUD_CHECK === "true";
  const modoPrueba = process.env.POWERTRANZ_MODO_PRUEBA === "true";
  const aceptaU = process.env.POWERTRANZ_ACEPTAR_3DS_U === "true";
  const aceptaSin3DS = process.env.POWERTRANZ_ACEPTAR_SIN_3DS === "true";
  const pasaporte = hay("PASAPORTE_API_KEY");

  return (
    <div className="bg-black/40 border border-[#cddbf2]/10 rounded-2xl p-5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-[#cddbf2]/70">
            Estado de la pasarela
          </h2>
          <p className="text-xs text-[#cddbf2]/40 mt-1">
            Qué hay configurado en este entorno. No se muestra ningún valor secreto.
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
            pasarelaLista
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-amber-500/15 text-amber-300"
          }`}
        >
          {pasarelaLista ? "Puede cobrar" : "No puede cobrar todavía"}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <Señal ok={credenciales} texto={credenciales ? "Credenciales de BAC cargadas" : "Faltan POWERTRANZ_ID / PASSWORD"} />
        <Señal
          ok={paginas}
          texto={paginas ? "Página alojada configurada" : "Falta el PageSet — pendiente de FAC"}
          aviso={!paginas}
        />
        <Señal ok={Boolean(base)} texto={base ? (enStaging ? "Ambiente: pruebas (staging)" : "Ambiente: PRODUCCIÓN") : "Falta POWERTRANZ_BASE_URL"} aviso={Boolean(base) && !enStaging} />
        <Señal
          ok={antifraude}
          texto={antifraude ? "Antifraude encendido" : "Antifraude apagado — pendiente de FAC"}
          aviso={!antifraude}
        />
        <Señal ok={pasaporte} texto={pasaporte ? "Activación de pasaporte lista" : "Falta PASAPORTE_API_KEY"} />
        <Señal ok={Boolean(process.env.NEXT_PUBLIC_SITE_URL)} texto={process.env.NEXT_PUBLIC_SITE_URL ? "URL de retorno configurada" : "Falta NEXT_PUBLIC_SITE_URL"} />
      </div>

      {(modoPrueba || aceptaU || aceptaSin3DS) && (
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {modoPrueba && (
            <Señal aviso ok={false} texto="MODO PRUEBA: se puede simular un cobro. Nunca en producción." />
          )}
          {aceptaU && <Señal aviso ok={false} texto="Se cobra con 3DS 'U' — sin protección ante contracargos" />}
          {aceptaSin3DS && <Señal aviso ok={false} texto="Se cobra sin 3DS — sin protección ante contracargos" />}
        </div>
      )}
    </div>
  );
}
