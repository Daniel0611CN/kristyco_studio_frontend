import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpClient = inject(HttpClient);
  storageService = inject(StorageService);

  private apiAuthUrl = environment.apiUrl + '/auth';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post(
      this.apiAuthUrl + '/login',
      {
        username,
        password
      },
      this.httpOptions
    );
  }

  register(username: string, apellido1: string, apellido2: string, email: string, telefono: string, direccion: string, password: string, rol: string) {
    let registerRequest = {
      "username": username,
      "apellido1": apellido1,
      "apellido2": apellido2,
      "email": email,
      "telefono": telefono,
      "direccion": direccion,
      "password": password,
      "roles": [rol]
    };

    return this.httpClient.post(
      this.apiAuthUrl + '/register',
      JSON.stringify(registerRequest),
      this.httpOptions
    );
  }

  logout() {
    this.storageService.clean();
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }

}
