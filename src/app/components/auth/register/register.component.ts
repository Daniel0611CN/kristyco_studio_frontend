import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SwalService } from '../../shared/services/swal.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  authService = inject(AuthService);
  cd = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);
  router = inject(Router);
  swalService = inject(SwalService);

  showPassword = false;
  showForm = true;
  formSubmitted = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
    email: ['', [
      Validators.required,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
      Validators.minLength(12),
      Validators.maxLength(45)
    ]],
    password: ['', [
      Validators.required,
      Validators.maxLength(24),
      Validators.pattern(/^(?=(?:.*[a-z]){3,})(?=(?:.*[A-Z]){2,})(?=(?:.*\d){1,})(?=(?:.*[^a-zA-Z0-9]){1,}).{8,24}$/)
    ]],
    apellido1: ['', [Validators.required, Validators.maxLength(20)]],
    apellido2: ['', [Validators.maxLength(20)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    direccion: ['', [Validators.required]],
    rol: ['User'],
    privacy: [false, Validators.requiredTrue],
    terms_conditions: [false, Validators.requiredTrue]
  });

  onSubmit(): void {
    this.formSubmitted = true;

    const {
      username,
      apellido1,
      apellido2,
      email,
      telefono,
      direccion,
      password,
      rol
    } = this.registerForm.value;

    this.authService.register(username, apellido1, apellido2, email, telefono, direccion, password, rol).subscribe({
      next: () => {
        this.showForm = false;
        this.swalService.showSuccess('Registro exitoso', 'Redirigiendo al login. Por favor, revise su correo.', 1000).then(() => {
          this.isLoggedIn = true;
          this.router.navigateByUrl('/login');
        });
      },
      error: err => {
        this.showForm = false;
        this.isLoginFailed = true;
        this.errorMessage = err?.error?.message || 'Error inesperado';

        if (this.errorMessage.includes('usuario')) {
          this.showError('Nombre de usuario ya registrado', this.errorMessage);
        } else if (this.errorMessage.includes('email')) {
          this.showError('Correo ya registrado', this.errorMessage);
        } else if (this.errorMessage.includes('teléfono')) {
          this.showError('Teléfono ya registrado', this.errorMessage);
        } else if (this.errorMessage.includes('rol')) {
          this.showError('Rol inválido', this.errorMessage);
        } else if (this.errorMessage.includes('correo de confirmación')) {
          this.showError('Error de envío', this.errorMessage);
        } else {
          this.showError('Error desconocido', this.errorMessage);
        }
      }
    });
  }

  showError(title: string, text: string): void {
    this.swalService.showError(title, text).then(() => this.onReload());
  }

  onReload(): void {
    this.showForm = true;
    this.isLoginFailed = false;
    this.formSubmitted = false;
    this.cd.detectChanges();
  }

  onClose(): void {
    this.router.navigateByUrl('/login');
  }

  get hasLength(): boolean {
    const val = this.password?.value || '';
    return val.length >= 8 && val.length <= 20;
  }

  get hasLowercase(): boolean {
    const value = this.password?.value || '';
    return (value.match(/[a-z]/g) || []).length >= 3;
  }

  get hasUppercase(): boolean {
    const value = this.password?.value || '';
    return (value.match(/[A-Z]/g) || []).length >= 2;
  }

  get hasNumber(): boolean {
    const value = this.password?.value || '';
    return (value.match(/[0-9]/g) || []).length >= 2;
  }

  get hasSpecialChar(): boolean {
    const value = this.password?.value || '';
    return /[^A-Za-z0-9]/.test(value);
  }

  get isPasswordStrong(): boolean {
    return (
      this.hasLength &&
      this.hasLowercase &&
      this.hasUppercase &&
      this.hasNumber &&
      this.hasSpecialChar
    );
  }

  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get email() { return this.registerForm.get('email'); }
  get apellido1() { return this.registerForm.get('apellido1'); }
  get apellido2() { return this.registerForm.get('apellido2'); }
  get telefono() { return this.registerForm.get('telefono'); }
  get direccion() { return this.registerForm.get('direccion'); }
}
