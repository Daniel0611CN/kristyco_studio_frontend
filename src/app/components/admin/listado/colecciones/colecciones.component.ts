import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColeccionService } from '../../../../services/coleccion.service';
import { SwalService } from '../../../shared/services/swal.service';
import { ColeccionFormComponent } from "./coleccion-form/coleccion-form.component";

interface Coleccion {
  id: number;
  nombre: string;
  descripcion?: string;
}

@Component({
  selector: 'app-colecciones',
  standalone: true,
  imports: [CommonModule, ColeccionFormComponent],
  templateUrl: './colecciones.component.html'
})
export class ListadoColeccionComponent {
  private coleccionService = inject(ColeccionService);
  private swalService = inject(SwalService);

  public title: string = 'Listado de Colecciones';

  public columnas: { key: keyof Coleccion, label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' }
  ];

  public colecciones: WritableSignal<Coleccion[]> = signal([]);
  public selectedItem: WritableSignal<Coleccion | null> = signal(null);

  constructor() {
    this.loadColecciones();
  }

  private loadColecciones(): void {
    this.coleccionService.all().subscribe({
      next: (data) => this.colecciones.set(data),
      error: (err) => {
        console.error('Error al cargar colecciones:', err);
        this.swalService.showError('Error de Carga', 'No se pudieron obtener las colecciones.');
      }
    });
  }

  public handleSave(coleccion: Partial<Coleccion>): void {
    const isUpdating = !!coleccion.id;
    const action = isUpdating
      ? this.coleccionService.update(coleccion.id!, coleccion)
      : this.coleccionService.create(coleccion);

    const successMessage = isUpdating ? 'actualizada' : 'creada';

    action.subscribe({
      next: () => {
        this.loadColecciones();
        this.closeModalAndShowSuccess(`Colección ${successMessage} exitosamente.`);
      },
      error: (err) => {
        console.error(`Error al ${successMessage} la colección:`, err);
        this.swalService.showError(`Error al ${successMessage}`, `No se pudo guardar la colección.`);
      }
    });
  }

  public handleDelete(): void {
    const itemToDelete = this.selectedItem();
    if (!itemToDelete) return;

    this.coleccionService.delete(itemToDelete.id).subscribe({
      next: () => {
        this.loadColecciones();
        this.closeModalAndShowSuccess(`La colección "${itemToDelete.nombre}" ha sido eliminada.`);
      },
      error: (err) => {
        console.error('Error al eliminar la colección:', err);
        this.swalService.showError('Error al eliminar', 'No se pudo eliminar la colección.');
      }
    });
  }

  private closeModalAndShowSuccess(message: string): void {
      const modalElement = document.querySelector('.modal.show');
      if (modalElement) {
          const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();
      }
      this.swalService.showSuccess('Operación exitosa', message, 1500);
      this.selectedItem.set(null);
  }
}
