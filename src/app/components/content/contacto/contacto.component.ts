import { Enlaces } from '../../../models/interfaces/enlace.interface';
import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, NgClass],
  templateUrl: './contacto.component.html'
})
export class ContactoComponent {
  title: string = '¿Tienes dudas? !Estamos aquí para ayudaros¡';
  text: string = `  Planificar cada detalle de vuestra boda puede generar muchas dudas y preguntas, por eso
    <br>
    estamos comprometidos a resolverlas y guiaros en el camino. Ya sea para más información sobre
    <br>
    nuestras colecciones, materiales, inspiración o proceso de diseño, estamos disponibles para vosotros.
    <br><br><br><br>
    Contáctanos para agendar una reunión para conocerte y ayudarte a crear la papelería de tus
    <br>
    sueños a través de nuestro correo electrónico, teléfono o redes sociales.
    <br>
    Juntos, podemos hacer que cada detalle de tu boda sea tan especial
    <br>
    como siempre lo imaginaste.
    <br><br><br>
    Kristy & Co Studio: Diseños con alma, creados con amor.`;

    finalText = `<p>${this.text}</p>`;

    links: Enlaces[] = [
      { link: '#', label: 'fa-solid fa-phone' },
      { link: 'mailto:kristycostudio@gmail.com', label: 'fa-solid fa-envelope' },
      { link: 'https://api.whatsapp.com/send?phone=34684749656&text=Hola%20Cristina,%20me%20gustaria%20concertar%20una%20llamada%20contigo%20para%20que%20me%20expliques%20el%20proceso%20completo.',
        label: 'fa-brands fa-whatsapp'
      },
      { link: 'https://www.instagram.com/kristyco_studio/', label: 'fa-brands fa-instagram' }

    ]
}
