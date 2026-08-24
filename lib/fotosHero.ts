// Curaduría del fondo del hero (pedido del cliente, 24-ago-2026): en la
// rotación NO entran fotos con personas que no sean baristas (grupos de
// staff, clientes en mesas, peatones) ni fotos donde se lea el nombre de
// un local (rótulos, fachadas, tablas o camisas con el logo grande).
// Revisión foto por foto de las galerías; la clave es carpeta/archivo
// dentro del Blob. Si un café sube fotos nuevas con gente o con su
// rótulo, agregarlas aquí.
const FOTOS_HERO_EXCLUIDAS = [
  "tono-s-cafe-bakery/foto-05.webp", // clientes en mesas
  "tono-s-cafe-bakery/foto-06.webp", // gente en la terraza
  "kotowa-coffee-house/foto-01.webp", // persona (no barista)
  "kotowa-coffee-house/foto-02.webp", // persona (no barista)
  "kotowa-coffee-house/foto-03.webp", // rótulo del local
  "kotowa-coffee-house/foto-05.webp", // tabla con logo
  "kotowa-coffee-house/foto-07.webp", // tabla con logo
  "kotowa-coffee-house/foto-08.webp", // tabla con logo
  "siete-granos/foto-02.webp", // peatones + rótulo museo
  "siete-granos/foto-03.webp", // fachada con logo
  "siete-granos/foto-04.webp", // clientes en el local
  "foodbarn-cafe/foto-02.webp", // letrero del local
  "momo-coffee-shop/portada.webp", // foto grupal del staff
  "momo-coffee-shop/foto-07.webp", // foto grupal del staff
  "cabrera-coffee-brew-house/foto-01.webp", // rótulo + cliente
  "cabrera-coffee-brew-house/foto-02.webp", // clientes sentados
  "leto-coffee-brew-bar-roastery/foto-05.webp", // letras del local
  "sip-studio-cafe/foto-01.webp", // salón lleno de gente
  "sip-studio-cafe/foto-03.webp", // tabla con logo
  "sip-studio-cafe/foto-05.webp", // tarjeta con logo
  "sip-studio-cafe/foto-06.webp", // rótulo del local
  "sisu-coffee-studio/foto-04.webp", // nombre en la pared
  "tosto-coffee/portada.webp", // logo grande en camisa
  "tosto-coffee/foto-02.webp", // letrero del local
  "tosto-coffee/foto-03.webp", // logo grande en camisa
  "tosto-coffee/foto-04.webp", // logo grande en delantal
  "wknd-specialty-coffee/foto-01.webp", // clientes en mesas
  "wknd-specialty-coffee/foto-05.webp", // tabla con logo
];

export const esFotoHeroPermitida = (url: string) =>
  !FOTOS_HERO_EXCLUIDAS.some((f) => url.endsWith(f));
