import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../services/token.service';
import { SwalService } from '../../shared/services/swal.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  tokenService = inject(TokenService);
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  router = inject(Router);
  swalService = inject(SwalService);

  resetForm: FormGroup;

  token = signal<string>('');
  mensaje = signal<string>('');
  isTokenValid = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  constructor() {
    this.resetForm = this.fb.group({
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
    this.token.set(this.route.snapshot.paramMap.get('token') || '');
    this.verificarToken();
  }

  verificarToken() {
    this.tokenService.validateResetToken(this.token()).subscribe({
      next: res => {
        this.isTokenValid.set(res.valid);
        this.mensaje.set(res.message || 'Cuenta confirmada correctamente.');
      },
      error: err => this.swalService.showError('Token inválido', err.error?.Message || 'El token ha expirado o no es válido.').then(() => this.router.navigate(['/login']))
    });
  }

  passwordMatchValidator({ value: { password, confirmPassword }, get }: FormGroup): null {
    const confirmCtrl = get('confirmPassword');
    if (!confirmCtrl) return null;

    confirmCtrl.setErrors(password !== confirmPassword ? { mismatch: true } : null);
    return null;
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    const { password } = this.resetForm.value;

    this.tokenService.resetPassword(this.token(), password).subscribe({
      next: () => this.swalService.showSuccess('Contraseña actualizada', 'Ahora puedes iniciar sesión con tu nueva contraseña.').then(() => this.router.navigate(['/login'])),
      error: err => this.swalService.showError('Error', err.error?.message || 'No se pudo restablecer la contraseña.')
    });
  }

  get password() { return this.resetForm.get('password'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }

}
