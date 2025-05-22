import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/interfaces/entities/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUsuarioUrl = environment.apiUrl + '/usuarios';

  httpClient = inject(HttpClient);

  getAll(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.apiUsuarioUrl);
  }

  get(id: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.apiUsuarioUrl}/${id}`);
  }

}
