/**
 * Botón de descarga del Coffee Geeks Passport en el App Store.
 *
 * El logotipo va como SVG en línea y no como imagen: el archivo de Apple no
 * se puede enlazar desde su dominio y una copia nuestra se vería borrosa en
 * pantallas de alta densidad. Además así hereda el color del texto y sirve
 * sobre fondo claro y oscuro sin cambiar de archivo.
 */

export const URL_APP_STORE =
  "https://apps.apple.com/pa/app/coffee-geeks-passport/id6811569665";

export default function BotonAppStore({
  variante = "oscuro",
  tamano = "normal",
}: {
  /** `oscuro`: pastilla vino sobre fondo claro. `claro`: al revés. */
  variante?: "oscuro" | "claro";
  tamano?: "normal" | "chico";
}) {
  const claro = variante === "claro";
  const chico = tamano === "chico";

  return (
    <a
      href={URL_APP_STORE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Descargar Coffee Geeks Passport en el App Store"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: chico ? 9 : 12,
        padding: chico ? "9px 16px" : "12px 24px",
        borderRadius: 50,
        background: claro ? "#cddbf2" : "#38050e",
        color: claro ? "#38050e" : "#fff",
        border: claro ? "none" : "1px solid rgba(205,219,242,.25)",
        textDecoration: "none",
        fontFamily: "'Barlow',sans-serif",
        lineHeight: 1.1,
        transition: "transform .2s, background .2s",
        whiteSpace: "nowrap",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ width: chico ? 18 : 22, height: chico ? 18 : 22, fill: "currentColor", flexShrink: 0 }}
      >
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" />
      </svg>
      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span style={{ fontSize: chico ? 9 : 10, letterSpacing: ".1em", textTransform: "uppercase", opacity: 0.7 }}>
          Descárgala en el
        </span>
        <span style={{ fontSize: chico ? 14 : 17, fontWeight: 700, letterSpacing: ".01em" }}>
          App Store
        </span>
      </span>
    </a>
  );
}
