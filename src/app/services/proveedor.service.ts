import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Proveedor } from '@interfaces/entities/proveedor.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private http = inject(HttpClient);

  getAll(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(environment.apiUrl + '/proveedores');
  }
}
