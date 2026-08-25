import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cancelaciones, Devoluciones y Reembolsos · Coffee Geeks Panamá",
  description:
    "Política de Cancelaciones, Devoluciones y Reembolsos de Coffee Geeks Panamá, operado por Panamá International Firm by YelCaballero, S.EP.",
};

// Contenido legal provisto por EL ORGANIZADOR (Panamá International Firm). Debe
// publicarse en URL fija, enlazada desde el pie de página y accesible antes de
// confirmar cualquier pago, conforme a los requisitos de la pasarela afiliada.
const SECCIONES: { t: string; p: string[] }[] = [
  {
    t: "Quién opera esta Plataforma",
    p: [
      "Coffee Geeks Panamá (coffeegeekspanama.com) es operada por Panamá International Firm by YelCaballero, S.EP. (PIF), sociedad panameña inscrita a Ficha 2024, Documento 155760730 de la Sección Mercantil del Registro Público de Panamá, representada por Yelsica H. Caballero, cédula de identidad 4-762-865. En esta Política, a esta empresa la llamamos simplemente “EL ORGANIZADOR”.",
      "EL ORGANIZADOR es titular de las marcas registradas ante la DIGERPI de Panamá: PANAMA COFFEE GEEKS (Registro N.º 324604, Clase 41) y PANAMA UNIQUE (Registro N.º 324606, Clase 35). PANAMA COFFEE GEEKS: marca bajo la cual se presta el concurso “El Camino a la Gran Taza”, la Academia y las experiencias de café. PANAMA UNIQUE: marca bajo la cual EL ORGANIZADOR comercializa productos y experiencias de retail a través de panamaunique.com.",
      "La presente Política de Cancelaciones, Devoluciones y Reembolsos (en adelante, la “Política”) forma parte integral de los Términos y Condiciones de Compra y aplica a toda compra de productos y/o servicios realizada a través de la Plataforma, incluyendo, sin limitarse a, la Tienda, la Academia (Specialty Coffee Academy), las experiencias, eventos y el Pasaporte Digital del concurso “El Camino a la Gran Taza”.",
    ],
  },
  {
    t: "1. Marco legal aplicable",
    p: [
      "Esta Política se elabora conforme a la legislación vigente de la República de Panamá, en particular: Ley 45 de 31 de octubre de 2007, que dicta normas sobre protección al consumidor y defensa de la competencia, y su reglamento, el Decreto Ejecutivo N.º 46 de 2009; Ley 51 de 22 de julio de 2008, que regula los documentos y las firmas electrónicas y adopta disposiciones para el desarrollo del comercio electrónico, modificada por la Ley 82 de 2012; Ley 81 de 26 de marzo de 2019, sobre protección de datos personales; y las políticas y requerimientos de seguridad de la pasarela de pagos afiliada (BAC Credomatic / FAC E-commerce), en lo relativo a devoluciones, anulaciones y cargos en línea.",
      "En caso de conflicto entre esta Política y una norma legal imperativa de mayor jerarquía, prevalecerá esta última.",
    ],
  },
  {
    t: "2. Advertencia importante sobre el derecho de retracto en Panamá",
    p: [
      "A diferencia de otras legislaciones, la Ley 45 de 2007 no establece un derecho general de retracto (arrepentimiento de compra) aplicable a todas las transacciones comerciales. El derecho de retracto reconocido por la ley panameña se limita, principalmente, a las ventas de bienes a domicilio (3 días hábiles desde la entrega), a los casos de publicidad engañosa y a los supuestos de garantía por defectos del producto. Por ello, salvo en dichos supuestos legales o cuando EL ORGANIZADOR lo ofrezca expresamente como cortesía comercial en los términos de esta Política, no existe una obligación legal de aceptar devoluciones por simple insatisfacción o cambio de parecer del consumidor.",
    ],
  },
  {
    t: "3. Definiciones",
    p: [
      "Consumidor: persona natural o jurídica que adquiere un producto o servicio como destinatario final a través de la Plataforma. Producto: bienes físicos ofrecidos en la Tienda (café, mercancía oficial, accesorios, entre otros). Servicio: cursos o módulos de la Academia, membresías, entradas a eventos, experiencias guiadas y demás prestaciones no consistentes en la entrega de un bien físico.",
      "Pasaporte Digital: herramienta de gamificación del concurso “El Camino a la Gran Taza” mediante la cual el usuario registra visitas a cafeterías participantes y acumula puntos. No constituye un producto físico ni un documento de viaje (ver Sección 8). Pasarela de pagos: sistema de procesamiento de pagos electrónicos afiliado a la Plataforma (BAC Credomatic / FAC E-commerce u otro medio habilitado).",
    ],
  },
  {
    t: "4. Cancelación de pedidos — Productos (Tienda)",
    p: [
      "El Consumidor puede solicitar la cancelación de un pedido de productos físicos siempre que la solicitud se realice antes de que el pedido haya sido despachado o entregado al transportista. Una vez despachado, la cancelación se regirá por la sección de devoluciones.",
      "Las solicitudes de cancelación deben enviarse a info@coffeegeekspanama.com o por WhatsApp al 6825-6583, indicando el número de orden. EL ORGANIZADOR confirmará por escrito la cancelación y, de haberse realizado el cargo, iniciará el proceso de reembolso conforme a la Sección 7.",
    ],
  },
  {
    t: "5. Devoluciones de productos ya entregados",
    p: [
      "Se aceptan devoluciones dentro de un plazo de 3 días hábiles contados desde la entrega, únicamente cuando el producto: (i) presente defectos de fabricación; (ii) no corresponda a las características anunciadas en la Plataforma; o (iii) haya sido entregado en cantidad, referencia o estado distinto al solicitado. El producto debe devolverse en su empaque original, sin uso, con todos sus accesorios y comprobante de compra.",
      "Productos perecederos (café tostado o molido) solo podrán devolverse si el defecto es atribuible a EL ORGANIZADOR (empaque roto, producto vencido o contaminado al momento de la entrega), por razones sanitarias. Fuera de los supuestos anteriores, y conforme a la Sección 2 de esta Política, EL ORGANIZADOR no está obligado a aceptar devoluciones por cambio de parecer; no obstante, podrá evaluar solicitudes de cambio por otra referencia, como cortesía comercial, sujeto a disponibilidad.",
    ],
  },
  {
    t: "6. Cancelaciones — Academia, eventos y experiencias",
    p: [
      "Cursos de la Academia: el Consumidor podrá cancelar su inscripción y solicitar reembolso total hasta 5 días calendario antes del inicio del curso o módulo adquirido. Cancelaciones con menos de 5 días de anticipación darán derecho a un crédito equivalente para una futura edición del mismo curso, salvo que EL ORGANIZADOR decida, a su discreción, reembolsar el monto pagado.",
      "Eventos, galas y experiencias con cupo limitado (por ejemplo, activaciones del concurso “El Camino a la Gran Taza”): las entradas o cupos adquiridos no son reembolsables una vez confirmada la reserva, salvo cancelación del evento por parte de EL ORGANIZADOR, en cuyo caso aplicará la Sección 7.",
      "Si EL ORGANIZADOR cancela, reprograma o modifica sustancialmente un curso, evento o experiencia, el Consumidor tendrá derecho, a su elección, a: (i) reembolso total del monto pagado, o (ii) transferencia del cupo a una nueva fecha u otro producto de valor equivalente. Las causas de fuerza mayor no imputables a EL ORGANIZADOR (inasistencia del Consumidor, condiciones climáticas, restricciones de viaje del participante, entre otras) no generan derecho a reembolso, sin perjuicio de que EL ORGANIZADOR pueda ofrecer, como cortesía, la reprogramación sujeta a disponibilidad.",
    ],
  },
  {
    t: "7. Reembolsos: plazos y método",
    p: [
      "Todo reembolso procedente se realizará mediante el mismo medio de pago utilizado en la compra original (acreditación a la tarjeta de crédito o débito a través de la pasarela de pagos), salvo imposibilidad técnica debidamente justificada. Conforme al Artículo 57 de la Ley 45 de 2007, cuando proceda la devolución de sumas pagadas en dinero, el Consumidor no está obligado a aceptar notas de crédito como forma exclusiva de reembolso.",
      "El plazo estimado de procesamiento del reembolso es de 5 a 15 días hábiles a partir de la aprobación de la solicitud, dependiendo de los tiempos de la entidad bancaria emisora de la tarjeta del Consumidor, ajenos al control directo de EL ORGANIZADOR. Los reembolsos se procesan netos de comisiones de la pasarela de pagos que, conforme a las políticas de BAC Credomatic / FAC, se cobran por cada anulación o devolución procesada y no son recuperables por EL ORGANIZADOR.",
    ],
  },
  {
    t: "8. Aclaración sobre el “Pasaporte Digital” y documentos de identidad",
    p: [
      "El Pasaporte Digital PANAMA COFFEE GEEKS (PCG) es una herramienta de gamificación asociada al concurso “El Camino a la Gran Taza” para registrar visitas y acumular puntos. No es un bien ni un servicio pagado sujeto a reembolso, y no constituye, sustituye ni tiene validez como documento de identidad, viaje, migratorio o de cruce de fronteras. Su nombre es exclusivamente comercial y de mercadeo del concurso.",
      "Cuando la Plataforma requiera verificar la identidad de un Consumidor o participante (por ejemplo, para la entrega de premios, la validación de mayoría de edad o la prevención de fraude), podrá solicitarse cédula de identidad personal (nacionales) o pasaporte (extranjeros o turistas) como documento de identificación. Se deja constancia expresa de que, para dichos efectos, el pasaporte es reconocido únicamente como documento de identidad de carácter turístico y de viaje, y su presentación ante EL ORGANIZADOR no lo habilita ni lo convierte en un documento válido para trámites de cruce de fronteras, control migratorio o similares, los cuales son competencia exclusiva de las autoridades migratorias del país correspondiente.",
    ],
  },
  {
    t: "9. Casos excluidos de reembolso",
    p: [
      "Servicios o accesos digitales ya consumidos o utilizados en su totalidad (por ejemplo, un curso ya completado o un certificado ya emitido); productos personalizados o elaborados a solicitud específica del Consumidor; cupones, promociones, descuentos o votos del concurso, los cuales no tienen valor monetario ni son canjeables por dinero; y cargos rechazados por el banco emisor por causas atribuibles al Consumidor (fondos insuficientes, datos erróneos, etc.).",
    ],
  },
  {
    t: "10. Procedimiento para solicitar una cancelación o reembolso",
    p: [
      "Enviar solicitud a info@coffeegeekspanama.com indicando: nombre completo, número de orden o factura, producto/servicio adquirido y motivo de la solicitud. EL ORGANIZADOR acusará recibo dentro de 2 días hábiles y podrá solicitar evidencia adicional (fotografías del producto, comprobante de pago, etc.). Una vez evaluada la solicitud, se notificará por escrito la resolución (aprobación, rechazo o solución alternativa) dentro de un plazo máximo de 10 días hábiles.",
    ],
  },
  {
    t: "11. Autoridad competente y canal de reclamos",
    p: [
      "Sin perjuicio de los canales internos de atención al cliente antes descritos, el Consumidor puede presentar sus reclamos ante la Autoridad de Protección al Consumidor y Defensa de la Competencia (ACODECO) de la República de Panamá, cuando lo estime pertinente.",
    ],
  },
  {
    t: "12. Contacto",
    p: [
      "¿Necesitas ayuda con tu compra? Escríbenos a info@coffeegeekspanama.com o por WhatsApp al 6825-6583 / 6934-5115. Estamos en Ciudad de Panamá, República de Panamá.",
    ],
  },
];

export default function CancelacionesPage() {
  return (
    <main className="relative min-h-screen py-16 px-4">
      <div className="absolute inset-0 -z-10 fixed">
        <Image src="/background.webp" alt="" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      </div>

      <div className="z-10 max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
          ← Volver al inicio
        </Link>

        <div className="p-8 md:p-12 rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-1 tracking-wide">Política de Cancelaciones, Devoluciones y Reembolsos</h1>
          <p className="text-white/50 text-sm">Coffee Geeks Panamá · coffeegeekspanama.com</p>
          <p className="text-white/40 text-xs mt-1 mb-8">Versión 1.0 · Última actualización: 25 de agosto de 2026</p>

          <div className="flex flex-col gap-7">
            {SECCIONES.map((s) => (
              <section key={s.t}>
                <h2 className="text-white font-semibold text-lg mb-2">{s.t}</h2>
                {s.p.map((par, i) => (
                  <p key={i} className="text-white/80 text-sm leading-relaxed mb-2">
                    {par}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/15 text-white/50 text-xs">
            Ver también:{" "}
            <Link href="/terminos-de-compra" className="underline hover:text-white">
              Términos y Condiciones de Compra
            </Link>{" "}
            ·{" "}
            <Link href="/privacidad" className="underline hover:text-white">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
