import { Pago } from "./pago.interface";
import { Producto } from "./producto.interface";
import { Usuario } from "./usuario.interface";

export interface Pedido {
  id: string;
  costeEnvio: number;
  direccion: string;
  estado: string;
  fecha: string;
  total: number;
  pago: Pago;
  usuario: Usuario;
  productos: Producto[];
}
