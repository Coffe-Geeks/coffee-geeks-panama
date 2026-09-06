import { CarritoProvider } from "@/app/components/tienda/CarritoContext";
import BotonCarrito from "@/app/components/tienda/BotonCarrito";

/**
 * El carrito vive solo bajo /tienda. El resto del sitio no lo necesita y
 * así no se carga estado de compra en páginas que no venden nada.
 */
export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <CarritoProvider>
      {children}
      <BotonCarrito />
    </CarritoProvider>
  );
}
