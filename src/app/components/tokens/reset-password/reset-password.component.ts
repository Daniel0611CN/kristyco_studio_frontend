import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;

  isTokenValid: boolean = false;
  oldPasswordValid: boolean = true;
  token: string = '';
  mensaje: string = '';

  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);

  constructor() {
    this.resetForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(24),
          Validators.pattern('^(?=(?:.*[a-z]){3,})(?=(?:.*[A-Z]){2,})(?=(?:.*\\d){1,})(?=(?:.*[^a-zA-Z0-9]){1,}).{8,24}$')
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.verificarToken();
  }

  verificarToken() {
    this.http.get<{ message: string, valid: boolean }>(
      `https://kristyco-studio-proyect.onrender.com/api/v1/confirmation_token/validate-reset-token?token=${this.token}`
    ).subscribe({
      next: res => {
        this.isTokenValid = res.valid;
        this.mensaje = res.message || 'Cuenta confirmada correctamente.';
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Token inválido',
          text: err.error?.Message || 'El token ha expirado o no es válido.',
          confirmButtonText: 'Aceptar'
        }).then(() => this.router.navigate(['/login']));
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (confirmPassword.errors && !confirmPassword.errors['mismatch']) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  validateOldPassword(): void {
    const oldPassword = this.oldPassword?.value;

    if (!oldPassword) return;

    this.http.post<{ valid: boolean, message?: string }>(
      'https://kristyco-studio-proyect.onrender.com/api/v1/confirmation_token/validate-old-password',
      {
        token: this.token,
        oldPassword: oldPassword
      }
    ).subscribe({
      next: (res) => {
        this.oldPasswordValid = res.valid;
        if (!res.valid) {
          this.resetForm.get('oldPassword')?.setErrors({ incorrect: true });
        } else {
          // Limpia el error si es válido
          this.resetForm.get('oldPassword')?.setErrors(null);
        }
      },
      error: () => {
        this.oldPasswordValid = false;
        this.resetForm.get('oldPassword')?.setErrors({ incorrect: true });
      }
    });
  }

  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    const { password } = this.resetForm.value;

    this.http.put(`https://kristyco-studio-proyect.onrender.com/api/v1/confirmation_token/reset-password`, {
      token: this.token,
      password: password
    }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
          confirmButtonText: 'Aceptar'
        }).then(() => this.router.navigate(['/login']));
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'No se pudo restablecer la contraseña.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  get oldPassword() { return this.resetForm.get('oldPassword'); }
  get password() { return this.resetForm.get('password'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }
}
