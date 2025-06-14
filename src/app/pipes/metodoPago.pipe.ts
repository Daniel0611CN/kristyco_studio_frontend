import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metodoPagoPipe'
})
export class MetodoPagoPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'BIZUM':
        return 'Bizum';
      case 'EFECTIVO':
        return 'Efectivo';
      case 'TARJETA':
        return 'Paypal';
      default:
        return value;
    }
  }
}
