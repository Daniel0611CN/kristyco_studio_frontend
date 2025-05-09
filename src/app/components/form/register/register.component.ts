import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  form: any = {
    username: null,
    apellido1: null,
    apellido2: null,
    email: null,
    telefono: null,
    direccion: null,
    password: null,
    rol: 'User'
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  authService = inject(AuthService);
  router = inject(Router);

  onSubmit(): void {
    const { username, apellido1, apellido2, email, telefono, direccion, password, rol } = this.form;

    this.authService.register(username, apellido1, apellido2, email, telefono, direccion, password, rol).subscribe({
      next: data => {
        this.router.navigate(['/login'])
      },
      error: err => {
        this.errorMessage = err.error.message;
      }
    });
  }
}
