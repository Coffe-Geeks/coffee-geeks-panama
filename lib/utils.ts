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

/**
 * Convierte en URL absoluta lo que se escribe en el admin.
 *
 * Quien llena una ficha escribe "www.ejemplo.com" o "@sucuenta", no
 * "https://www.ejemplo.com". Puesto tal cual en un href, el navegador lo
 * toma como ruta relativa y manda a un 404 dentro de nuestro propio sitio:
 * fue exactamente lo que pasó en las fichas de fincas.
 *
 * Devuelve cadena vacía si el valor no sirve como enlace, para que quien
 * llama simplemente no lo pinte.
 */
const DOMINIOS_RED: Record<string, string> = {
  instagram: "instagram.com",
  facebook: "facebook.com",
  twitter: "x.com",
  youtube: "youtube.com",
};

export function enlaceExterno(valor?: string, red?: string): string {
  const v = (valor || "").trim();
  if (!v) return "";

  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith("//")) return `https:${v}`;

  const dominio = red ? DOMINIOS_RED[red] : undefined;

  // Un usuario suelto: "@cuenta" o "cuenta", sin puntos ni barras
  if (dominio && (v.startsWith("@") || !/[./]/.test(v))) {
    const usuario = v.replace(/^@+/, "");
    if (!usuario) return "";
    // YouTube identifica los canales con la arroba incluida
    return red === "youtube"
      ? `https://${dominio}/@${usuario}`
      : `https://${dominio}/${usuario}`;
  }

  // "www.ejemplo.com", "ejemplo.com/algo"
  if (/^[\w-]+(\.[\w-]+)+/.test(v)) return `https://${v}`;

  return "";
}
