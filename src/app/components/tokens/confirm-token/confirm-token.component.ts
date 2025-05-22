import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirm-token',
  imports: [],
  templateUrl: './confirm-token.component.html'
})
export class ConfirmTokenComponent {
  mensaje = '';

  route = inject(ActivatedRoute);
  httpClient = inject(HttpClient);
  router = inject(Router);

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    console.log(token);
    if (token) {
      this.httpClient.get<{ message: string }>(`https://kristyco-studio-proyect.onrender.com/api/v1/confirmation_token/confirm-register?token=${token}`)
        .subscribe({
          next: res => {
            this.mensaje = res.message || 'Cuenta confirmada correctamente.';
          },
          error: err => {
            if (err.status === 401) {
              this.mensaje = err.error?.message || 'El token es inválido o ha expirado.';
            } else {
              this.mensaje = 'Error al validar el token';
            }
          }
        });
    } else {
      this.mensaje = 'Token no válido';
    }
  }
}
