import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoPedidoPipe'
})
export class EstadoPedidoPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'EN_CAMINO':
        return 'En Camino';
      case 'ENTREGADO':
        return 'Entregado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return value;
    }
  }
}
