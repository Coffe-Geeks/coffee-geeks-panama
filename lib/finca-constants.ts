/**
 * Constantes de fincas sin dependencias de Mongoose, para que los
 * componentes cliente puedan importarlas sin arrastrar el driver al bundle.
 * models/Finca.ts las reexporta para el esquema.
 */

// Provincias/regiones cafetaleras de Panamá
export const FINCA_REGIONS = [
  "Boquete",
  "Volcán",
  "Renacimiento",
  "Tierras Altas",
  "Santa Fe",
  "Otra",
] as const;

export type FincaRegion = (typeof FINCA_REGIONS)[number];

export function isFincaRegion(value: string): value is FincaRegion {
  return (FINCA_REGIONS as readonly string[]).includes(value);
}

export const PROCESS_TYPES = ["Lavado", "Natural", "Honey", "Anaeróbico", "Mixto"] as const;
