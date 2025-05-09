export interface Pago {
  id: string;
  monto: number;
  fecha: Date
  estadoPago: string;
  metodoPago: string;
}
