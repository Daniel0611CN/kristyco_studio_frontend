import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-coleccion',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './coleccion.component.html'
})
export class ColeccionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  title = 'COLECCIÓN';
  subtitle = '';
  text = '';
  subnavItems: { label: string; link: string }[] = [];

  ngOnInit(): void {
    const nombre = this.route.snapshot.paramMap.get('nombre')?.toLowerCase() ?? 'aire';
    this.subtitle = this.capitalize(nombre);

    this.setTextForCollection(nombre);

    this.subnavItems = [
      { label: 'Invitaciones', link: `/colecciones/${nombre}/invitaciones` },
    ];
  }

  private setTextForCollection(nombre: string): void {
    switch (nombre) {
      case 'aire':
        this.text = `
          <strong>DEFINICIÓN</strong><br>
          El aire es esencial para la vida en el planeta y transparente a simple vista.
          <br><br><strong>CONCEPTO</strong><br>
          El concepto de esta primera colección es la de tener presente siempre los elementos esenciales de la vida, que puedas parar un
          momento, respirar y mirar al cielo, dejarte volar, dejarte soñar! Todo esto te permite una tranquilidad en el proceso de tu boda
          desde lo más básico sabiendo apreciar cada instante.
          <br><br><strong>STORYTELLING</strong><br>
          Colección inspirada en el movimiento, en el ligero aleteo de una mariposa, en la hierba
          de los campos donde la suave brisa la hace bailar, en el sonido de tu respiración, llena
          de amor, que se convierte en música, tu música, tu calma, tu aire.
          <br><br><strong>BENEFICIOS</strong><br>
          La Colección ”Aire” es amplia como para permitirte combinar entre tipografías, color
          así como el texto a elegir entre invitaciones con los mismos elementos,
          dándole también tu toque personal.
        `;
        break;

      case 'aqua':
        this.text = `
          <strong>DEFINICIÓN</strong><br>
          El agua es el principio de todo. Es el origen de la vida, la esencia que fluye, se adapta y permanece.
          <br><br><strong>CONCEPTO</strong><br>
          La colección Aqua nace del susurro del mar y la calma de la arena. Una colección que celebra la belleza natural.
          <br><br><strong>STORYTELLING</strong><br>
          La Colección Aqua se inspira en la pureza y la fuerza del mar, en la serenidad de sus aguas y la belleza de sus conchas y caracolas. Todo lo que forma parte de este elemento esencial para la vida me inspira a crear algo lleno de energía, elegancia y frescura.
          <br><br><strong>BENEFICIOS</strong><br>
          Cada diseño es un reflejo del océano en calma, con tonos suaves y texturas orgánicas que evocan la serenidad de las aguas cristalinas. Detalles artesanales, tonos naturales y un diseño único para que tu historia sea aún más especial.
        `;
        break;

      case 'nature':
        this.text = `
          <strong>DEFINICIÓN</strong><br>
          Nature: Donde la belleza de la naturaleza se transforma en arte en papel.
          <br><br><strong>CONCEPTO</strong><br>
          Nature es una colección de papelería artesanal para bodas inspirada en elementos naturales: texturas orgánicas, colores tierra, detalles botánicos y materiales sostenibles. Diseños hechos a mano que evocan la conexión con lo simple y lo verdadero, ideales para parejas que valoran lo natural, lo artesanal y lo significativo.
          <br><br><strong>STORYTELLING</strong><br>
          La inspiración para esta colección Nature es un tributo a lo esencial, a la belleza orgánica y a los pequeños detalles que nos conectan con lo auténtico. Cada pieza está pensada para transmitir calma, armonía y elegancia, como si la naturaleza misma te invitara a celebrar el amor.
          <br><br><strong>BENEFICIOS</strong><br>
          Diseño exclusivo inspirado en la naturaleza, hecho a mano con amor con materiales de alta calidad y una estética armónica y elegante que eleva cualquier boda con un toque único.
        `;
        break;

      default:
        this.text = `No se ha podido obtener la información`;
        break;
    }
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
