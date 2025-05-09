import { ColeccionService } from '../../../../../services/coleccion.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lcoleccion',
  imports: [CommonModule],
  templateUrl: './lcoleccion.component.html'
})
export class LcoleccionComponent {
  title: string = 'Listado de Colecciones';
  columnas: { key: string, label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' }
  ];
  data: any[] = [];
  searchText: string = '';

  coleccionService = inject(ColeccionService);

  ngOnInit(): void {
    this.listarPedidos();
  }

  private listarPedidos() {
    this.coleccionService.all().subscribe({
      next: (response: any) => {
        this.data = response;
      },
      error: (err) => {
        console.error('Error al obtener las colecciones:', err);
      }
    });
  }

}
