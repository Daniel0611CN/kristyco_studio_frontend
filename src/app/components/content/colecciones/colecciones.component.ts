import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-colecciones',
  imports: [RouterLink],
  templateUrl: './colecciones.component.html',
})
export class ColeccionesComponent implements OnInit {

  subnavItems: { label: string; link: string }[] = [];

  ngOnInit(): void {
      this.subnavItems = [
      { label: 'Acabados', link: '/acabados' },
      { label: 'Detalles', link: '/detalles' },
      { label: 'Regalos', link: '/regalos' }
    ];
  }

}
