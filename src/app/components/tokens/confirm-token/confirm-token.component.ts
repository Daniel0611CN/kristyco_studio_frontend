import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-confirm-token',
  imports: [],
  templateUrl: './confirm-token.component.html'
})
export class ConfirmTokenComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  mensaje = signal<string>('');

  isAccountConfirmed = effect(() => {
      const msg = this.mensaje();
      if (msg === 'Cuenta confirmada correctamente.') {
        localStorage.setItem('Confirm-Token-Registered', '1');
        this.router.navigateByUrl('/login');
      }
  });

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token') || '';

    if (token !== '') {
      this.confirmToken(token)
    } else {
      this.mensaje.set('Token no válido');
    }
  }

  private confirmToken(token: string): void {
    this.tokenService.confirmationToken(token).subscribe({
      next: () => this.handleSuccess(),
      error: err => this.handleError(err)
    });
  }

  private handleSuccess(): void {
    this.mensaje.set('Cuenta confirmada correctamente.');
  }

  private handleError(err: HttpErrorResponse): void {
    if (err.status === 401) {
      this.mensaje.set(err.error?.message || 'El token es inválido o ha expirado.');
    } else {
      this.mensaje.set('Error al validar el token');
    }
  }

}
