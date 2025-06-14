import { Component, effect, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Page } from '@interfaces/page.interface';
import { Producto } from '@interfaces/entities/producto.interface';
import { Categoria } from '@interfaces/entities/categoria.interface';
import { Proveedor } from '@interfaces/entities/proveedor.interface';

import { ProductoService } from '@services/invitacion.service';
import { SwalService } from '@shared/services/swal.service';
import { CategoriaService } from '@services/categoria.service';
import { ProveedorService } from '@services/proveedor.service';

import { SearchComponent } from '@shared/components/tables/search/search.component';
import { PaginatorComponent } from '@shared/components/tables/paginator/paginator.component';
import { ColumnSortComponent } from '@shared/components/tables/column-sort/column-sort.component';
import { InvitacionFormComponent } from './invitacion-form/invitacion-form.component';

export type OrderableFieldInvitacion = 'id' | 'nombre' | 'descripcion' | 'precio' | 'stock';

@Component({
  selector: 'app-invitaciones',
  imports: [CommonModule, PaginatorComponent, ColumnSortComponent, SearchComponent, InvitacionFormComponent],
  templateUrl: './invitaciones.component.html',
})
export class ListadoInvitacionComponent {
  private readonly swalService = inject(SwalService);
  private readonly productoService = inject(ProductoService);

  private readonly categoriaService = inject(CategoriaService);
  private readonly proveedorService = inject(ProveedorService);

  readonly categorias = signal<Categoria[]>([]);
  readonly proveedores = signal<Proveedor[]>([]);

  readonly title = signal('Listado de Productos');
  readonly listaProductos = signal<Producto[]>([]);

  readonly showFormModal = signal(false);
  readonly formMode = signal<'crear' | 'editar'>('crear');
  readonly currentProducto = signal<Partial<Producto> | null>(null);

  readonly searchText = signal('');
  readonly page = signal(1);
  readonly currentSort = signal<{ fieldQuery: OrderableFieldInvitacion; order: string } | undefined>(undefined);

  readonly pageSize = signal(10);
  readonly totalSize = signal(0);

  constructor() {
    effect((onCleanup) => {
      this.page();
      this.searchText();
      this.currentSort();
      const subscription = this.getAllByPage();
      onCleanup(() => subscription.unsubscribe());
    });

    this.loadCategorias();
    this.loadProveedores();
  }

  private loadCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: (err: HttpErrorResponse) => this.swalService.showError('Error', 'No se pudieron cargar las categorías.')
    });
  }

  private loadProveedores(): void {
    this.proveedorService.getAll().subscribe({
      next: (proveedores) => this.proveedores.set(proveedores),
      error: (err: HttpErrorResponse) => this.swalService.showError('Error', 'No se pudieron cargar los proveedores.')
    });
  }

  openCreateModal() {
    this.formMode.set('crear');
    this.currentProducto.set(null);
    this.showFormModal.set(true);
  }

  openEditModal(producto: Producto) {
    this.formMode.set('editar');
    this.currentProducto.set(producto);
    this.showFormModal.set(true);
  }

  closeModals() {
    this.showFormModal.set(false);
    const closeBtn = document.querySelector('#formModal .btn-close') as HTMLElement;
    closeBtn?.click();
    this.currentProducto.set(null);
  }

  handleFormSubmit(producto: Producto): void {
    if (this.formMode() === 'crear') {
      this.saveNewProducto(producto);
    } else {
      this.updateProducto(producto);
    }
  }

  private saveNewProducto(productoToCreate: Producto): void {
    this.productoService.create(productoToCreate).subscribe({
      next: (newProducto) => {
        this.listaProductos.update(productos => [newProducto, ...productos].slice(0, this.pageSize()));
        this.totalSize.update(total => total + 1);
        this.closeModals();
        this.swalService.showSuccess('¡Creado!', 'El producto ha sido creado correctamente.', 1000);
      },
      error: (err: HttpErrorResponse) => this.swalService.showError('Error', err.error?.message || 'No se pudo crear el producto.')
    });
  }

  private updateProducto(productoToUpdate: Producto): void {
    const id = this.currentProducto()?.id;
    if (!id) return;

    this.productoService.update(id, productoToUpdate).subscribe({
      next: (updatedProducto) => {
        this.listaProductos.update(productos =>
          productos.map(p => p.id === updatedProducto.id ? updatedProducto : p)
        );
        this.closeModals();
        this.swalService.showSuccess('¡Actualizado!', 'El producto ha sido actualizado correctamente.', 1000);
      },
      error: (err: HttpErrorResponse) => this.swalService.showError('Error', err.error?.message || 'No se pudo actualizar el producto.')
    });
  }

  confirmDelete(id: number): void {
    this.swalService.showWarning('¿Estás seguro?', 'Sí, eliminar', 'Esta acción no se puede deshacer.').then(result => {
      if (result.isConfirmed) {
        this.productoService.delete(id).subscribe({
          next: () => {
            this.listaProductos.update(productos => productos.filter(p => p.id !== id));
            this.totalSize.update(total => total - 1);
            this.swalService.showSuccess('¡Eliminado!', 'El producto ha sido eliminado.');
          },
          error: (err: HttpErrorResponse) => this.swalService.showError('Error', err.error?.message || 'No se pudo eliminar el producto.')
        });
      }
    });
  }

  onSearch({ searchText }: { searchText: string }): void {
    this.page.set(1);
    this.searchText.set(searchText);
  }

  onChangePage(page: number): void {
    this.page.set(page);
  }

  onChangeOrder(order: { fieldQuery: OrderableFieldInvitacion; order: string }): void {
    this.page.set(1);
    this.currentSort.set(order);
  }

  onClearOrder(): void {
    this.currentSort.set(undefined);
  }

  private getAllByPage(): Subscription {
    return this.productoService.getWithFilters(this.currentSort(), this.page(), this.searchText()).subscribe({
      next: (data) => this.processData(data as Page<Producto>),
      error: (err: HttpErrorResponse) => this.swalService.showError('Error', err.error?.message || 'No se pudieron obtener los productos')
    });
  }

  private processData(data: Page<Producto>): void {
    this.totalSize.set(data.totalElements);
    this.listaProductos.set(data.content);
  }
}
