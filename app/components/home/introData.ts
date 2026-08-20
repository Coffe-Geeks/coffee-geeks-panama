// B-rolls propios que rotan de fondo en el hero. Viven en el Blob (no en el
// repo): son ~137 MB entre los ocho y el deploy no tiene por qué cargarlos.
const BLOB = "https://67nfjlu2uec5rb7z.public.blob.vercel-storage.com/brolls";

export const INTRO_BROLLS = [
  `${BLOB}/cg_broll_01_foodbarn_espresso.mp4`,
  `${BLOB}/cg_broll_02_sisu_filtrado.mp4`,
  `${BLOB}/cg_broll_03_kotowa_espresso.mp4`,
  `${BLOB}/cg_broll_04_tosto_filtrado.mp4`,
  `${BLOB}/cg_broll_05_sip_espresso.mp4`,
  `${BLOB}/cg_broll_06_wknd_filtrado.mp4`,
  `${BLOB}/cg_broll_07_momo_espresso.mp4`,
  `${BLOB}/cg_broll_08_leto_filtrado.mp4`,
];

export const INTRO_POSTER = `${BLOB}/poster.jpg`;

// Tarjetas del carrusel-intro. Copy y destinos EDITABLES.
export type IntroCard = {
  key: string;
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  img: string;
  logo?: boolean;
};

export const INTRO_CARDS: IntroCard[] = [
  {
    key: "camino",
    eyebrow: "LA RUTA DEL CAFÉ",
    title: "EL CAMINO A LA\nGRAN TAZA",
    desc: "Conoce las cafeterías que compiten en la temporada 2026 y vota por tu favorita: la mejor taza de Panamá la eliges tú.",
    cta: "VER MÁS",
    href: "/participantes",
    img: "/concurso.webp",
    logo: true,
  },
  {
    key: "pasaporte",
    eyebrow: "PASAPORTE DIGITAL",
    title: "PASAPORTE\nDIGITAL",
    desc: "Encuentra tu próxima taza perfecta. Descubre qué cafeterías de la competencia están cerca de ti y planifica tu recorrido.",
    cta: "VER MÁS",
    href: "/pasaporte",
    img: "/concurso.webp",
  },
  {
    key: "fincas",
    eyebrow: "VIVE EL ORIGEN",
    title: "FINCAS",
    desc: "Recorre las fincas productoras de Boquete, Volcán y Renacimiento: catas, tours y experiencias directas con los productores del mejor café del mundo.",
    cta: "VER MÁS",
    href: "/guia-de-experiencias",
    img: "https://images.unsplash.com/photo-1524350876685-274059332603?w=1200",
  },
];
