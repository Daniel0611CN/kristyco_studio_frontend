import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;

  authService = inject(AuthService);
  cd = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);
  router = inject(Router);

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      apellido1: ['', [Validators.required, Validators.maxLength(20)]],
      apellido2: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9!#$%&'*\/=?^_`\{\|\}~\+\-]([\.]?[a-zA-Z0-9!#$%&'*\/=?^_`\{\|\}~\+\-])+@[a-zA-Z0-9]([^@&%$\/\(\)=?¿!\.,:;]|\d)+[a-zA-Z0-9][\.][a-zA-Z]{2,4}([\.][a-zA-Z]{3})?")]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      direccion: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(24),
          Validators.pattern('^(?=(?:.*[a-z]){3,})(?=(?:.*[A-Z]){2,})(?=(?:.*\\d){1,})(?=(?:.*[^a-zA-Z0-9]){1,}).{8,24}$')
        ]
      ],
      rol: 'User',
      privacy: [false, Validators.requiredTrue],
      terms_conditions: [false, Validators.requiredTrue]
    });

  }

  isLoggedIn = false;
  isLoginFailed = false;
  showForm: boolean = true;

  errorMessage = '';
  roles: string[] = [];

  showPassword = false;
  togglePassword() { this.showPassword = !this.showPassword; }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const formValues = this.registerForm.value;

    this.authService.register(formValues.username, formValues.apellido1, formValues.apellido2, formValues.email,
        formValues.telefono, formValues.direccion, formValues.password, formValues.rol).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registro existoso',
          text: `Redirigiendo a login, consulte su email para poder iniciar sesión.`,
          showConfirmButton: true
        }).then(() => {
          this.isLoggedIn = true;
          this.router.navigateByUrl("/login");
        });
      },
      error: err => {
        this.showForm = false;
        this.isLoginFailed = true;

        this.errorMessage = err?.error?.message;

        if (this.errorMessage.includes('usuario')) {
          Swal.fire({
            icon: 'error',
            title: 'Nombre de usuario ya registrado',
            text: this.errorMessage,
            confirmButtonText: 'Aceptar'
          }).then(() => { this.onReload(); });
        } else if (this.errorMessage.includes('email')) {
          Swal.fire({
            icon: 'error',
            title: 'Correo ya registrado',
            text: this.errorMessage,
            confirmButtonText: 'Aceptar'
          }).then(() => { this.onReload(); });
        } else if (this.errorMessage.includes('telefono')) {
          Swal.fire({
            icon: 'error',
            title: 'Teléfono ya registrado',
            text: this.errorMessage,
            confirmButtonText: 'Aceptar'
          }).then(() => { this.onReload(); });
        } else if (this.errorMessage.includes('rol')) {
          Swal.fire({
            icon: 'error',
            title: 'Rol inválido',
            text: this.errorMessage,
            confirmButtonText: 'Aceptar'
          }).then(() => { this.onReload(); });
        } else if (this.errorMessage.includes('correo de confirmación')) {
          Swal.fire({
            icon: 'error',
            title: 'Error de envío',
            text: this.errorMessage,
            confirmButtonText: 'Aceptar'
          }).then(() => { this.onReload(); });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error desconocido',
            text: this.errorMessage,
            confirmButtonText: 'Aceptar'
          }).then(() => { this.onReload(); });
        }
      }
    })
  }

  onReload() {
    this.showForm = true;
    this.isLoginFailed = false;
    this.cd.detectChanges();
  }

  onClose() {
    this.router.navigateByUrl('/login');
  }

  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get email() { return this.registerForm.get('email'); }
  get apellido1() { return this.registerForm.get('apellido1'); }
  get apellido2() { return this.registerForm.get('apellido2'); }
  get telefono() { return this.registerForm.get('telefono'); }
  get direccion() { return this.registerForm.get('direccion'); }

}
