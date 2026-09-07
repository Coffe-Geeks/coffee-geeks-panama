import { getPedidos } from "@/app/actions/pedidos";
import { ESTADOS_PEDIDO } from "@/models/Order";
import SelectorEstado from "./SelectorEstado";
import ActivacionPasaporte from "./ActivacionPasaporte";
import EstadoPasarela from "./EstadoPasarela";

export const dynamic = "force-dynamic";

const COLOR_ESTADO: Record<string, string> = {
  pendiente: "bg-amber-500/20 text-amber-300",
  pagado: "bg-green-500/20 text-green-400",
  rechazado: "bg-red-500/20 text-red-400",
  cancelado: "bg-white/10 text-[#cddbf2]/60",
  enviado: "bg-blue-500/20 text-blue-300",
  entregado: "bg-emerald-500/20 text-emerald-300",
};

function fecha(valor: string) {
  return new Date(valor).toLocaleString("es-PA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPedidosPage() {
  const pedidos = await getPedidos();

  // Solo cuenta lo efectivamente cobrado: lo pendiente todavía no es dinero
  const vendido = pedidos
    .filter((p: any) => ["pagado", "enviado", "entregado"].includes(p.status))
    .reduce((s: number, p: any) => s + p.total, 0);
  const porDespachar = pedidos.filter((p: any) => p.status === "pagado" && p.requiresShipping).length;

  // Pagados que compraron pasaporte y siguen sin activarlo: dinero cobrado
  // con el servicio sin entregar, lo primero que hay que ver al entrar.
  const pasaportesPendientes = pedidos.filter(
    (p: any) =>
      ["pagado", "enviado", "entregado"].includes(p.status) &&
      p.items?.some((i: any) => i.activatesPassport) &&
      !p.passportActivation?.ok
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Pedidos</h1>
          <p className="text-[#cddbf2]/60 font-medium">Compras de la tienda y su estado de pago</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-black/40 border border-[#cddbf2]/10 rounded-2xl px-6 py-3">
            <div className="text-[10px] uppercase tracking-widest text-[#cddbf2]/40 font-black">Cobrado</div>
            <div className="text-2xl font-black text-white tabular-nums">${vendido.toFixed(2)}</div>
          </div>
          <div className="bg-black/40 border border-[#cddbf2]/10 rounded-2xl px-6 py-3">
            <div className="text-[10px] uppercase tracking-widest text-[#cddbf2]/40 font-black">Por despachar</div>
            <div className="text-2xl font-black text-white tabular-nums">{porDespachar}</div>
          </div>
          {pasaportesPendientes > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-6 py-3">
              <div className="text-[10px] uppercase tracking-widest text-red-300/70 font-black">Pasaportes sin activar</div>
              <div className="text-2xl font-black text-red-300 tabular-nums">{pasaportesPendientes}</div>
            </div>
          )}
        </div>
      </div>

      <EstadoPasarela />

      {pedidos.length === 0 ? (
        <div className="bg-black/20 p-20 rounded-3xl border border-dashed border-[#cddbf2]/10 text-center">
          <p className="opacity-50 font-bold uppercase tracking-widest text-[#cddbf2]">
            Todavía no hay pedidos
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pedidos.map((p: any) => (
            <div
              key={p._id}
              className="bg-black/40 border border-[#cddbf2]/10 rounded-2xl p-5 hover:border-[#cddbf2]/30 transition-all"
            >
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-lg font-black text-white tracking-wide">{p.orderNumber}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                        COLOR_ESTADO[p.status] || "bg-white/10 text-[#cddbf2]/60"
                      }`}
                    >
                      {p.status}
                    </span>
                    {!p.requiresShipping && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-[#cddbf2]/10 text-[#cddbf2]/70">
                        digital
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-[#cddbf2]/80">
                    {p.customer.name} · {p.customer.email}
                    {p.customer.phone ? ` · ${p.customer.phone}` : ""}
                  </div>
                  <div className="text-xs text-[#cddbf2]/40 mt-1">{fecha(p.createdAt)}</div>

                  <ul className="mt-3 text-sm text-[#cddbf2]/70 space-y-0.5">
                    {p.items.map((i: any, idx: number) => (
                      <li key={idx}>
                        {i.quantity} × {i.name}
                        {i.variant ? ` · ${i.variant}` : ""}
                        <span className="opacity-50"> — ${(i.unitPrice * i.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  {p.requiresShipping && p.shippingAddress?.line1 && (
                    <div className="mt-3 text-xs text-[#cddbf2]/50 leading-relaxed">
                      📦 {p.shippingAddress.line1}
                      {p.shippingAddress.line2 ? `, ${p.shippingAddress.line2}` : ""} ·{" "}
                      {[p.shippingAddress.city, p.shippingAddress.province].filter(Boolean).join(", ")}
                      {p.shippingAddress.notes ? ` · ${p.shippingAddress.notes}` : ""}
                    </div>
                  )}

                  {p.payment?.isoResponseCode && (
                    <div className="mt-2 text-[11px] text-[#cddbf2]/35 font-mono">
                      pasarela: {p.payment.isoResponseCode}
                      {p.payment.authenticationStatus ? ` · 3DS ${p.payment.authenticationStatus}` : ""}
                      {p.payment.cardBrand ? ` · ${p.payment.cardBrand}` : ""}
                      {p.payment.transactionIdentifier ? ` · ${p.payment.transactionIdentifier}` : ""}
                    </div>
                  )}

                  {p.internalNotes && (
                    <div className="mt-2 text-[11px] text-amber-300/60">{p.internalNotes}</div>
                  )}

                  {/* Solo los pedidos que compraron pasaporte */}
                  {p.items?.some((i: any) => i.activatesPassport) &&
                    ["pagado", "enviado", "entregado"].includes(p.status) && (
                      <ActivacionPasaporte id={p._id} activacion={p.passportActivation} />
                    )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-2xl font-black text-white tabular-nums">${p.total.toFixed(2)}</div>
                  {p.shippingCost > 0 && (
                    <div className="text-[11px] text-[#cddbf2]/40 -mt-2">envío ${p.shippingCost.toFixed(2)}</div>
                  )}
                  <SelectorEstado id={p._id} estado={p.status} estados={[...ESTADOS_PEDIDO]} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
