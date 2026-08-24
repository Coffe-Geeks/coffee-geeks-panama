// Orden editorial de las cafeterías del concurso, compartido entre la home
// (sección Descúbrenos) y /participantes: los coffee shops con foto de su
// barista van primero; los que aún no tienen ninguna se acomodan de últimos.
// La foto puede venir de la portada editorial (convención portada-barista-*)
// o de la foto propia que el barista destacado subió en su ficha.

// Foto del barista de una cafetería: la portada editorial si es de barista,
// o la foto que subió el barista destacado en su ficha. Null si no hay.
export const fotoBarista = (c: any): string | null => {
  if (/(?:portada-)?barista/i.test(c.coverImage || "")) return c.coverImage;
  const destacado = Array.isArray(c.baristas)
    ? (c.baristas.find((b: any) => b.isHighlighted) || c.baristas[0])
    : null;
  return (destacado && destacado.photo) || null;
};

export const tieneFotoBarista = (c: any) => !!fotoBarista(c);

const completitud = (c: any) => {
  const conFoto = !!c.coverImage;
  const conFicha = !!(c.tagline || c.espresso || c.filtrado || c.signatureDrink);
  const galeria = Array.isArray(c.gallery) ? c.gallery.length : 0;
  return (conFoto && conFicha ? 100 : 0) + (conFoto ? 20 : 0) + (conFicha ? 15 : 0) + Math.min(galeria, 10);
};

// Muta el arreglo (igual que Array.sort) y lo devuelve para encadenar.
export function ordenarCafeterias(cafeterias: any[]) {
  return cafeterias.sort((a: any, b: any) => {
    const baristasPrimero = Number(tieneFotoBarista(b)) - Number(tieneFotoBarista(a));
    if (baristasPrimero !== 0) return baristasPrimero;

    const d = completitud(b) - completitud(a);
    if (d !== 0) return d;
    return (a.cafeteriaName || a.name || "").localeCompare(b.cafeteriaName || b.name || "");
  });
}
