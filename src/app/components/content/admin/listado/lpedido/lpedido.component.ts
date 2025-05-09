import { ColumnSortComponent } from "../../../../shared/column-sort/column-sort.component";
import { PaginatorComponent } from "../../../../shared/paginator/paginator.component";
import { Pedido } from '../../../../../models/interfaces/entities/pedido.interface';
import { SearchComponent } from "../../../../shared/search/search.component";
import { EstadoPedidoPipe } from "../../../../../pipes/estadoPedido.pipe";
import { PedidoService } from "../../../../../services/pedido.service";
import { Page } from '../../../../../models/interfaces/page.interface';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lpedido',
  imports: [CommonModule, FormsModule, SearchComponent, ColumnSortComponent, PaginatorComponent, EstadoPedidoPipe],
  templateUrl: './lpedido.component.html'
})
export class LpedidoComponent implements OnInit {
  title: string = 'Listado de Pedidos';

  total: any = { key: 'total', label: 'Coste Total', span: '€', type: 'number' };
  costeEnvio: any = { key: 'costeEnvio', label: 'Coste de Envío', span: '€', type: 'number' };

  formNgFor: any[] = [
    { key: 'fecha', label: 'Fecha de Registro', type: 'text', placeholder: '' },
    { key: 'direccion', label: 'Dirección', span: 'C/ nº', type: 'text', placeholder: 'Dirección' },
  ];

  estado: any = { key: 'estado', label: 'Estado de Envío',
    options: [
      { option: 'PENDIENTE', label: 'Pendiente' },
      { option: 'EN_CAMINO', label: 'En Camino' },
      { option: 'ENTREGADO', label: 'Entregado' },
      { option: 'CANCELADO', label: 'Cancelado' }
    ]
  };

  extraForm: any[] = [
    { key: 'usuario', label: 'Usuario' },
    { key: 'metodo', label: 'Método de Pago' },
    { key: 'estado', label: 'Estado del Pago' },
    { key: 'productos', label: 'Productos' }
  ];

  data: any[] = [];

  selectedItem: any = null;

  pedidoService = inject(PedidoService);

  prepararEdicion(row: any): void {
    this.selectedItem = { row };
    this.selectedItem = this.selectedItem.row;
  }

  guardarCambios(message: string, title: string = '¡Éxito!'): void {
    if (!this.selectedItem) return;
    const id: string = this.selectedItem.id;
    let pedido = this.selectedItem;
    this.pedidoService.update(id, pedido).subscribe({
      next: () => {
        return Swal.fire({
          title: title,
          text: message,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        })
      },
      error: (err) => {
        console.error('Error al actualizar el pedido', err);
      }
    })

  }

  cancelarEdicion() {
    this.selectedItem = null;
  }

  router = inject(Router);

  pedidos: Pedido[] = [];

  searchText: string = '';
  isLoading: boolean = false;

  pageSize: number = 10;
  totalSize: number = 0;
  page: number = 1;

  orderOutput?: {fieldQuery: string, order: string};
  orderNames: string[] = ['id', 'costeEnvio', 'direccion', 'estado', 'fecha', 'total'];
  orderNamesClear: {id: boolean, costeEnvio: boolean, direccion: boolean, estado: boolean, fecha: boolean, total: boolean } = { id: false, costeEnvio: false, direccion: false, estado: false, fecha: false, total: false };

  controlPedidoAdd: boolean = false;

  ngOnInit() {
   this.getAllByPage();
  }

  processData(data: Page<Pedido> | Pedido[]) {
    if ((<Page<Pedido>>data).content !== undefined) {
      this.totalSize = (<Page<Pedido>>data).totalElements;
      this.pedidos = (<Page<Pedido>>data).content;
    } else {
      this.totalSize = (<Pedido[]>data).length;
      this.pedidos = (<Pedido[]>data).slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    }
  }

  getAllByPage(search?: string) {
    this.isLoading = true;
    this.pedidoService.getWithFilters(this.orderOutput, this.page, search)
      .subscribe({
        next: (data) => {
          this.processData(data);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al obtener los pedidos', error);
          this.isLoading = false;
        }
      });
  }

  delete(id: string) {
    Swal.fire({
      title: '¿Estás seguro de que quieres archivar este pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidoService.delete(id).subscribe(() => {
          this.pedidos = this.pedidos.filter((ped) => ped.id !== id);
          Swal.fire({
            title: '¡Borrado!',
            text: 'El pedido ha sido archivado correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
        });
      }
    });
  }

  onSearch(searchData: { searchText: string }) {
    this.isLoading = false;
    this.page = 1;
    this.searchText = searchData.searchText;
    this.getAllByPage(this.searchText);
  }

  clearSearch() {
    this.searchText = '';
  }

  onChangePage(page: number) {
    this.page = page;

    if (this.searchText.length > 0) {
      this.getAllByPage(this.searchText);
    } else {
      this.getAllByPage();
    }
  }

  onChangeOrder(orderOutput: {fieldQuery: string, order: string}) {
    this.orderOutput = orderOutput;

    type ObjectKey = keyof typeof this.orderNamesClear;
    for (let orderName of this.orderNames) {
      if (orderName !== this.orderOutput.fieldQuery) {
        this.orderNamesClear[orderName as ObjectKey] = !this.orderNamesClear[orderName as ObjectKey] ;
      }
    }

    this.page = 1;

    if (this.searchText.length > 0) {
      this.getAllByPage(this.searchText);
    } else {
      this.getAllByPage();
    }
  }

  onClearOrder() {
    this.orderOutput = undefined;

    type ObjectKey = keyof typeof this.orderNamesClear;
    for (let orderName of this.orderNames) {
        this.orderNamesClear[orderName as ObjectKey] = !this.orderNamesClear[orderName as ObjectKey] ;
    }

    if (this.searchText.length > 0) {
      this.getAllByPage(this.searchText);
    } else {
      this.getAllByPage();
    }
  }

  // onNewPedido(pedidoOutPut: {costeEnvio: number, direccion: string, estado: string, fecha: string, total: number}) {
  //   this.pedidoService.create(pedidoOutPut as Pedido).subscribe( (data) => {
  //     this.controlPedidoAdd = false;
  //     this.getAllByPage();
  //   });
  // }

}
