export interface Pago {
  id: string;
  monto: number;
  fecha: Date
  estado: string;
  metodoPago: string;
}

export class Pago {
  id: string;
  monto: number;
  fecha: Date;
  estado: string;
  metodo: string;

  constructor(id = '', monto = 0, fecha = new Date(), estado = 'PENDIENTE', metodo = 'EFECTIVO') {
    this.id = id;
    this.monto = monto;
    this.fecha = fecha;
    this.estado = estado;
    this.metodo = metodo;
  }
}
