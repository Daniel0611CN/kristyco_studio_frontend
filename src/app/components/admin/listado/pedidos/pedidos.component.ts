import { Component, effect, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Page } from '@interfaces/page.interface';
import { Pedido } from '@interfaces/entities/pedido.interface';
import { Producto } from '@interfaces/entities/producto.interface';
import { PedidoService } from '@services/pedido.service';
import { SwalService } from '@shared/services/swal.service';
import { EstadoPedidoPipe } from '@pipes/estadoPedido.pipe';
import { SearchComponent } from '@shared/components/tables/search/search.component';
import { PaginatorComponent } from '@shared/components/tables/paginator/paginator.component';
import { ColumnSortComponent } from '@shared/components/tables/column-sort/column-sort.component';
import { PedidoFormComponent } from './pedido-form/pedido-form.component';

export type OrderableFieldPedido = 'id' | 'costeEnvio' | 'direccion' | 'estado' | 'fecha' | 'total';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, SearchComponent, ColumnSortComponent, PaginatorComponent, EstadoPedidoPipe, PedidoFormComponent],
  templateUrl: './pedidos.component.html'
})
export class ListadoPedidoComponent {
  private readonly swalService = inject(SwalService);
  private readonly pedidoService = inject(PedidoService);

  readonly title = signal('Listado de Pedidos');
  readonly listaPedidos = signal<Pedido[]>([]);
  readonly productosPedidoSeleccionado = signal<Producto[]>([]);
  readonly pedidoSeleccionado = signal<Pedido | null>(null);
  readonly originalItem = signal<Pedido | null>(null);
  readonly pageSize = signal(10);
  readonly totalSize = signal(0);
  readonly sortColumnStates: Record<OrderableFieldPedido, boolean> = {id: false, costeEnvio: false, direccion: false, estado: false, fecha: false, total: false};
  private readonly orderNames: OrderableFieldPedido[] = ['id', 'costeEnvio', 'direccion', 'estado', 'fecha', 'total'];

  readonly searchText = signal('');
  readonly page = signal(1);
  readonly currentSort = signal<{ fieldQuery: OrderableFieldPedido; order: string } | undefined>(undefined);

  constructor() {
    effect(() => {
      this.page();
      this.searchText();
      this.currentSort();

      this.getAllByPage();
    });
  }

  onSearch({ searchText }: { searchText: string }): void {
    this.page.set(1);
    this.searchText.set(searchText);
  }

  onChangePage(page: number): void {
    this.page.set(page);
  }

  onChangeOrder(order: { fieldQuery: OrderableFieldPedido; order: string }): void {
    this.page.set(1);
    this.currentSort.set(order);
    this.toggleSortStates(order.fieldQuery);
  }

  onClearOrder(): void {
    this.currentSort.set(undefined);
    this.toggleSortStates();
  }

  onPedidoUpdated(pedidoActualizado: Pedido): void {
  this.listaPedidos.update(pedidos => {
    return pedidos.map(p => p.id === pedidoActualizado.id ? pedidoActualizado : p);
  });
  this.pedidoSeleccionado.set(null);
}


  prepararEdicion(pedido: Pedido): void {
    this.originalItem.set(JSON.parse(JSON.stringify(pedido)));
    this.pedidoSeleccionado.set(pedido);
    this.productosPedidoSeleccionado.set(pedido.productos ?? []);
  }

  showDelete(id: string): void {
    this.swalService
      .showWarning('¿Estás seguro de que quieres archivar este pedido?', 'Sí, archivar')
      .then(result => {
        if (result.isConfirmed) {
          this.delete(id);
        }
      });
  }

  private delete(id: string): void {
    this.pedidoService.delete(id).subscribe({
      next: () => {
        this.listaPedidos.update(pedidos => pedidos.filter(p => p.id !== id));
        this.swalService.showSuccess('¡Archivado!', 'El pedido ha sido archivado correctamente.', 1500);
      },
      error: () => this.swalService.showError('Error', 'No se ha podido archivar el pedido.')
    });
  }

  private getAllByPage(): void {
    this.pedidoService.getWithFilters(this.currentSort(), this.page(), this.searchText()).subscribe({
      next: data => this.processData(data),
      error: (err: HttpErrorResponse) => this.swalService.showError('Error', err.error?.message || 'No se pudieron obtener los pedidos')
    });
  }

  private processData(data: Page<Pedido> | Pedido[]): void {
    if ('content' in data) {
      this.totalSize.set(data.totalElements);
      this.listaPedidos.set(data.content);
    }  else {
      this.totalSize.set((<Pedido[]>data).length);
      this.listaPedidos.set((<Pedido[]>data).slice((this.page() - 1) * this.pageSize(), this.page() * this.pageSize()));
    }
  }

  private toggleSortStates(exclude?: string) {
    for (const key of this.orderNames) {
      if (!exclude || key !== exclude) this.sortColumnStates[key] = !this.sortColumnStates[key];
    }
  }
}
