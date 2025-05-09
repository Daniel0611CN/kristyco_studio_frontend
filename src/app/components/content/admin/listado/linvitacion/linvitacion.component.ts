import { ColumnSortComponent } from '../../../../shared/column-sort/column-sort.component';
import { Producto } from '../../../../../models/interfaces/entities/producto.interface';
import { PaginatorComponent } from '../../../../shared/paginator/paginator.component';
import { ProductoService } from '../../../../../services/invitacion.service';
import { SearchComponent } from '../../../../shared/search/search.component';
import { Page } from '../../../../../models/interfaces/page.interface';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-linvitacion',
  imports: [CommonModule, FormsModule, SearchComponent, ColumnSortComponent, PaginatorComponent],
  templateUrl: './linvitacion.component.html'
})
export class LinvitacionComponent {
  title: string = 'Listado de Invitaciones';

  productos: Producto[] = [];

  searchText: string = '';

  isLoading: boolean = false;

  pageSize: number = 10;
  totalSize: number = 0;
  page: number = 1;

  orderOutput?: {fieldQuery: string, order: string};
  orderNames: string[] = ['id', 'nombre', 'descripcion', 'precio', 'stock'];
  orderNamesClear: {id: boolean, nombre: boolean, descripcion: boolean, precio: boolean, stock: boolean } = { id: false, nombre: false, descripcion: false, precio: false, stock: false };

  productoService = inject(ProductoService);

  selectedItem: any = null;

  ngOnInit() {
     this.getAllByPage();
    }

  processData(data: Page<Producto> | Producto[]) {
    if ((<Page<Producto>>data).content !== undefined) {
      this.totalSize = (<Page<Producto>>data).totalElements;
      this.productos = (<Page<Producto>>data).content;
    } else {
      this.totalSize = (<Producto[]>data).length;
      this.productos = (<Producto[]>data).slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    }
  }

  getAllByPage(search?: string) {
    this.isLoading = true;
    this.productoService.getWithFilters(this.orderOutput, this.page, search)
      .subscribe({
        next: (data) => {
          this.processData(data);
          console.log(data);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al obtener los productos', error);
          this.isLoading = false;
        }
      });
  }

  prepararEdicion(row: any): void {
    this.selectedItem = { row };
    this.selectedItem = this.selectedItem.row;
  }

  guardarCambios(message: string, title: string = '¡Éxito!'): void {
    // if (!this.selectedItem) return;
    // const id: string = this.selectedItem.id;
    // let pedido = this.selectedItem;
    // this.productoService.update(id, pedido).subscribe({
    //   next: () => {
    //     return Swal.fire({
    //       title: title,
    //       text: message,
    //       icon: 'success',
    //       confirmButtonText: 'Aceptar',
    //     })
    //   },
    //   error: (err) => {
    //     console.error('Error al actualizar el pedido', err);
    //   }
    // })
  }

  cancelarEdicion() {
    this.selectedItem = null;
  }

  delete(id: string) {
    // Swal.fire({
    //   title: '¿Estás seguro de que quieres archivar este pedido?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Sí, archivar',
    //   cancelButtonText: 'Cancelar',
    //   confirmButtonColor: '#d33',
    //   cancelButtonColor: '#3085d6'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.productoService.delete(id).subscribe(() => {
    //       this.productos = this.productos.filter((prod) => prod.id !== id);
    //       Swal.fire({
    //         title: '¡Borrado!',
    //         text: 'El pedido ha sido archivado correctamente.',
    //         icon: 'success',
    //         timer: 1500,
    //         showConfirmButton: false,
    //       });
    //     });
    //   }
    // });
  }

  onSearch(searchData: { searchText: string }) {
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

}
