import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  title: string = 'Bienvenidos a';
  span: string = 'Kristy&Co Studio';
  subtitle: string = 'Cree en tu día, nosotros lo creamos';
  text: string = `Bienvenidos a Kristy & Co Studio Diseños con Alma, Creados con Amor
        En Kristy & Co Studio, nos gusta contar historias de amor a través del diseño
        y la creatividad. Creamos invitaciones de boda y papelería complementaria con
        acabados handmade. Cada una de nuestras colecciones está diseñada para reflejar
        la sencillez y esencia de cada pareja.`
}
