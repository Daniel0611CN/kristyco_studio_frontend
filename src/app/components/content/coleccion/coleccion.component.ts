import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-coleccion',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './coleccion.component.html'
})
export class ColeccionComponent {
  subnavItems: {label: string, link: string}[] = [
    { label: 'Invitaciones', link: '/invitaciones' },
    { label: 'Acabados', link: '/home' },
    { label: 'Detalles', link: '/home' },
    { label: 'Regalos', link: '/home' }
  ];
  title: string = 'COLECCIÓN'
  subtitle: string = 'Aire';
  text: string = `DEFINICIÓN
    <p><p>
    El aire es esencial para la vida en el planeta y transparente a simple vista.
    <br><br>
    CONCEPTO
    <br><br>
    El concepto de esta primera colección es la de tener presente siempre los elementos esenciales de la vida,
    que puedas parar un momento, respirar y mirar al cielo, dejarte volar, dejarte soñar! Todo esto te permite
    una tranquilidad en el proceso de tu boda desde lo más básico sabiendo apreciar cada instante.
    <br><br>
    STORYTELLING
    <br><br>
    Colección inspirada en el movimiento, en el ligero aleteo de una mariposa, en la hierba de los campos donde
    la suave brisa la hace bailar, en el sonido de tu respiración, llena de amor, que se convierte en música,
    tu música, tu calma, tu aire.
    <br><br>
    BENEFICIOS
    <br><br>
    La Colección ”Aire” es amplia como para permitirte combinar entre tipografías, color así como el texto a
    elegir entre invitaciones con los mismos elementos, dándole también tu toque personal.`

  finalText = `<p>${this.text}</p>`;

}
