import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Categoria } from '@interfaces/entities/categoria.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(environment.apiUrl + '/categorias');
  }
}
