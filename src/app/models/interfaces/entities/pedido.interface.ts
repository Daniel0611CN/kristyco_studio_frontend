import { Pago } from "./pago.interface";
import { Producto } from "./producto.interface";
import { Usuario } from './usuario.interface';

export interface Pedido {
  id: string;
  costeEnvio: number;
  direccion: string;
  estado: string;
  fecha: Date;
  total: number;
  pago: Pago;
  usuario: Usuario;
  productos: Producto[];
}

export class Pedido {
  id: string;
  costeEnvio: number;
  direccion: string;
  estado: string;
  fecha: Date;
  total: number;
  pago: Pago;
  usuario: Usuario;
  productos: Producto[];

  constructor(id = '', costeEnvio = 0, direccion = '', estado = 'PENDIENTE', fecha = new Date(), total = 0, pago: Pago = new Pago(), usuario: Usuario = new Usuario(), productos: Producto[] = []) {
    this.id = id;
    this.costeEnvio = costeEnvio;
    this.direccion = direccion;
    this.estado = estado;
    this.fecha = fecha;
    this.total = total;
    this.pago = pago;
    this.usuario = usuario;
    this.productos = productos;
  }
}

