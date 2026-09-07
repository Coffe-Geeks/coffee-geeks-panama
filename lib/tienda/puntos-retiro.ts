/**
 * Puntos de venta y retiro del pasaporte físico.
 *
 * El pasaporte es digital —la cuenta se crea al aprobarse el pago, ver
 * lib/tienda/pasaporte.ts— y además tiene una libreta física. No hay
 * delivery: el comprador la retira en uno de estos establecimientos.
 *
 * Van como constante y no en la base porque la lista es de la organización,
 * no del comercio: cambia por temporada, no por operación diaria. Si algún
 * día hay que moverla desde el admin, se pasa a una colección sin tocar
 * quien la consume.
 */

export type PuntoRetiro = {
  nombre: string;
  ubicacion: string;
};

export const PUNTOS_RETIRO: PuntoRetiro[] = [
  { nombre: "Toño's Cafe Bakery", ubicacion: "Costa del Este" },
  { nombre: "Sisu Studio", ubicacion: "Calle Uruguay" },
  { nombre: "FoodBarn", ubicacion: "Marbella" },
  { nombre: "Kotowa Coffee House", ubicacion: "Vía Israel" },
  { nombre: "Café Unido", ubicacion: "Casco Viejo" },
  { nombre: "Tosto Coffee House", ubicacion: "Obarrio" },
  { nombre: "MOMO Coffee Shop", ubicacion: "Obarrio" },
  { nombre: "WKDN Specialty Coffee", ubicacion: "Transístmica" },
  { nombre: "Leto Coffee Brew Bar", ubicacion: "Obarrio" },
  { nombre: "Sip Studio", ubicacion: "AltaPlaza" },
  { nombre: "Siete Granos", ubicacion: "Casco Viejo" },
  { nombre: "Café Vera", ubicacion: "Hotel Sofitel, Casco Viejo" },
  { nombre: "Bungla Coffee House", ubicacion: "Calle Uruguay" },
  { nombre: "Cabrera Coffee Brew House", ubicacion: "Vía Argentina" },
  { nombre: "Los Establos by Kotowa", ubicacion: "Boquete" },
  { nombre: "Toño's Factory", ubicacion: "Corozal" },
  { nombre: "La Micaela Coffee Shop", ubicacion: "Hotel InterContinental Miramar, Ave. Balboa" },
  { nombre: "Kfé Break", ubicacion: "Bella Vista" },
  { nombre: "Valentino Siesto Club", ubicacion: "San Francisco" },
  { nombre: "Hotel La Compañía", ubicacion: "Casco Viejo" },
  { nombre: "Pedro Mandinga", ubicacion: "Vía Argentina" },
  { nombre: "Pedro Mandinga", ubicacion: "Casco Viejo" },
  { nombre: "Aeropuerto Internacional de Tocumen", ubicacion: "Tocumen" },
];
