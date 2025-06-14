import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColeccionService {
  private apiCategoriaUrl = environment.apiUrl + '/categorias';

  httpClient = inject(HttpClient);

  all(): Observable<any> {
    return this.httpClient.get<any>(this.apiCategoriaUrl);
  }

  create(categoria: any): Observable<any> {
    return this.httpClient.post<any>(this.apiCategoriaUrl, categoria);
  }

  one(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiCategoriaUrl}/${id}`);
  }

  update(id: number, categoria: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiCategoriaUrl}/${id}`, categoria);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiCategoriaUrl}/${id}`);
  }

}
