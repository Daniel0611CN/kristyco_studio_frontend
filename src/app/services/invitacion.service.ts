import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Producto } from '../models/interfaces/entities/producto.interface';
import { Page } from '../models/interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiProductoUrl = environment.apiUrl +  '/productos';

  httpClient = inject(HttpClient);

   getWithFilters(orderOutput?: { fieldQuery: string; order: string }, page?: number, search?: string, size: number = 10): Observable<Page<Producto> | Producto[]> {
      let queryParams: { sort?: string; page?: number; size?: number; nombre?: string; } = {};

      if (orderOutput) {
        queryParams.sort = orderOutput.fieldQuery + ',' + orderOutput.order;
      }

      if (page) {
        queryParams.page = page - 1;
        queryParams.size = size;
      }

      if (search) {
        queryParams.nombre = search;
      }

      return this.httpClient.get<Page<Producto> | Producto[]>(this.apiProductoUrl, { params: queryParams });
    }

  get(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiProductoUrl}/${id}`);
  }

  // create(pedido: Pedido): Observable<Pedido> {
  //     return this.httpClient.post<Pedido>(this.apiPedidoUrl, pedido);
  // }

}
