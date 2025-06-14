import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoPagoPipe'
})
export class EstadoPagoPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'COMPLETADO':
        return 'Completado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return value;
    }
  }
}
