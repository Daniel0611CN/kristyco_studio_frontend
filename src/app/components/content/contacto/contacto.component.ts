import { Enlaces } from '../../../models/interfaces/enlace.interface';
import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { TITLE, TEXT, LINKS } from '../../shared/content/contacto.content';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, NgClass],
  templateUrl: './contacto.component.html'
})
export class ContactoComponent {
  title: string = TITLE;
  finalText: string = TEXT;
  links: Enlaces[] = LINKS;

  copiarTelefono(): void {
    navigator.clipboard.writeText(LINKS[0]?.link).then(() => alert('Número de teléfono copiado al portapapeles')).catch(err =>
      console.error('Error al copiar el número:', err));
  }
}
