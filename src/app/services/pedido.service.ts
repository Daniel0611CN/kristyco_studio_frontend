import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../models/interfaces/page.interface';
import { environment } from '../../environments/environment';
import { Pedido } from '../models/interfaces/entities/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiPedidoUrl = environment.apiUrl + '/pedidos';

  httpClient = inject(HttpClient);

  getWithFilters(orderOutput?: { fieldQuery: string; order: string }, page?: number, search?: string, size: number = 10): Observable<Page<Pedido> | Pedido[]> {
    let queryParams: { sort?: string; page?: number; size?: number; direccion?: string; estado?: string; } = {};

    if (orderOutput) {
      queryParams.sort = orderOutput.fieldQuery + ',' + orderOutput.order;
    }

    if (page) {
      queryParams.page = page - 1;
      queryParams.size = size;
    }

    if (search && search.toLowerCase() != 'pendiente' && search.toLowerCase() != 'en camino' && search.toLowerCase() != 'entregado' && search.toLowerCase() != 'cancelado') {
      queryParams.direccion = search;
    } else if (search) {
      if (search.toLowerCase() == 'pendiente') search = 'PENDIENTE'
      else if (search.toLowerCase() == 'en camino') search = 'EN_CAMINO';
      else if (search.toLowerCase() == 'entregado') search = 'ENTREGADO';
      else if (search.toLowerCase() == 'cancelado') search = 'CANCELADO';
      queryParams.estado = search;
    }

    return this.httpClient.get<Page<Pedido> | Pedido[]>(this.apiPedidoUrl, { params: queryParams });
  }

  get(id: string): Observable<Pedido> {
    return this.httpClient.get<Pedido>(`${this.apiPedidoUrl}/${id}`);
  }

  create(pedido: Pedido): Observable<Pedido> {
    return this.httpClient.post<Pedido>(this.apiPedidoUrl, pedido);
  }

  update(id: string, pedido: Pedido): Observable<Pedido> {
    pedido.id = id;
    return this.httpClient.put<Pedido>(`${this.apiPedidoUrl}/${id}`, pedido);
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiPedidoUrl}/${id}`);
  }

}
