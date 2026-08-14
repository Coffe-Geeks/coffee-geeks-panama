export function getSlugId(name: string, id: string) {
  const slug = (name || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${slug}-${id}`;
}

/**
 * Formatea la fecha de cierre guardada en la configuración del sitio.
 *
 * El campo admite tanto una fecha ISO (lo que guarda el selector del
 * admin) como texto escrito a mano de configuraciones anteriores. Si no
 * es una fecha reconocible se devuelve tal cual, para no romper valores
 * heredados.
 */
export function formatFechaCierre(
  valor?: string,
  formato: "larga" | "corta" = "larga"
): string {
  if (!valor) return "";
  const d = new Date(valor);
  if (isNaN(d.getTime())) return valor;

  // "2026-10-25" se interpreta como medianoche UTC; formatearlo en hora de
  // Panamá (UTC-5) lo retrasaría un día. Una fecha sin hora se formatea en
  // UTC para que muestre exactamente el día escrito.
  const soloFecha = /^\d{4}-\d{2}-\d{2}$/.test(valor.trim());
  const zona = soloFecha ? "UTC" : "America/Panama";

  const opciones: Intl.DateTimeFormatOptions =
    formato === "corta"
      ? { day: "numeric", month: "short", timeZone: zona }
      : { day: "numeric", month: "long", year: "numeric", timeZone: zona };

  const texto = d.toLocaleDateString("es-PA", opciones).replace(".", "");
  return formato === "corta" ? texto.toUpperCase() : texto;
}
