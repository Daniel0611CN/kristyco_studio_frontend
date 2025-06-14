import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto } from '../models/interfaces/entities/producto.interface';
import { Page } from '../models/interfaces/page.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiProductoUrl = environment.apiUrl +  '/productos';

  httpClient = inject(HttpClient);

  getWithFilters(orderOuput?: { fieldQuery: string; order: string }, page?: number, search?: string, size: number = 10): Observable<Page<Producto> | Producto[]> {
    let queryParams: { sort?: string; page?: number; size?: number; nombre?: string; } = {};

    if (orderOuput) {
      queryParams.sort = orderOuput.fieldQuery + ',' + orderOuput.order;
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

  getAll(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiProductoUrl}/list`);
  }

  get(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiProductoUrl}/${id}`);
  }

  create(producto: Producto): Observable<Producto> {
    return this.httpClient.post<Producto>(this.apiProductoUrl, producto);
  }

  update(id: number, producto: Producto): Observable<Producto> {
    return this.httpClient.put<Producto>(`${this.apiProductoUrl}/${id}`, producto);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiProductoUrl}/${id}`);
  }

}
