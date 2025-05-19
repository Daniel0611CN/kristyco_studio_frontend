import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { ERol } from '../../../models/enums/rol.enum';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';

declare function initTooltips(): void;

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  storageService = inject(StorageService);
  authService = inject(AuthService);
  userService = inject(UsuarioService);
  cd = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);
  router = inject(Router);
  httpClient = inject(HttpClient);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  user: any = {};
  roles: string[] = [];
  auxiliar: any = {};

  errorMessage = '';
  showForm: boolean = true;
  isLoggedIn: boolean = false;
  isLoginFailed: boolean = false;

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
    setTimeout(() => initTooltips(), 0);
  }

  showPassword = false;
  togglePassword() { this.showPassword = !this.showPassword; }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { username, password, rememberMe } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data, rememberMe);
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.showForm = false;
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: `¡Bienvenido ${data.username}! Redirigiendo...`,
          timer: 1000,
          showConfirmButton: false
        }).then(() => {
          this.isLoggedIn = true;
          const targetRoute = this.roles.includes(ERol.ROL_ADMIN) ? '/admin' : '/home';
          this.router.navigate([targetRoute]);
        });
      },
      error: err => {
        this.showForm = false;
        this.isLoginFailed = true;

        this.errorMessage = err?.error?.message;

        if (this.errorMessage.includes('contraseña')) {
          Swal.fire({
            icon: 'error',
            title: 'Contraseña incorrecta',
            text: this.errorMessage,
            confirmButtonText: 'Aceptar'
          }).then(() => { this.onReload(); });
        } else if (this.errorMessage.includes('correo')) {
          Swal.fire({
            icon: 'warning',
            title: 'Cuenta deshabilitada',
            html: `
              <p>${this.errorMessage}</p>
              <p>¿Quieres reenviar el correo de confirmación?</p>
            `,
            showCancelButton: true,
            confirmButtonText: 'Reenviar correo',
            cancelButtonText: 'Cancelar'
          }).then(result => {
            if (result.isConfirmed) {
              this.reenviarConfirmacion();
            } else {
              this.onReload();
            }
          });
        } else if (this.errorMessage.includes('usuario')) {
          Swal.fire({
            icon: 'error',
            title: 'Cuenta inexistente',
            text: this.errorMessage,
            confirmButtonText: 'Aceptar'
          }).then(() => { this.onReload(); });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error desconocido',
            text: 'Error interno del sistema, inténtelo de nuevo o contacte al soporte.',
            confirmButtonText: 'Aceptar'
          }).then(() => { this.onReload(); });
        }
      }
    });
  }

  onReload() {
    this.showForm = true;
    this.isLoginFailed = false;
    this.cd.detectChanges();
    setTimeout(() => { initTooltips(); }, 0);
  }

  resetEmail = '';

  onPasswordReset() {
    this.showForm = false;
    console.log('Restablecer contraseña para', this.resetEmail);
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  reenviarConfirmacion() {
    const username = this.loginForm.get('username')?.value;

    this.httpClient.put(`http://localhost:8080/api/v1/confirmation_token/revalidate-token/${username}`, {})
      .subscribe({
        next: res => {
          Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'Correo de confirmación reenviado correctamente. Revisa tu bandeja de entrada.',
            confirmButtonText: 'Aceptar'
          }).then(() => {this.onReload()});
        },
        error: err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo reenviar el correo. Verifica si tu cuenta ya está activada o si el token sigue vigente.',
            confirmButtonText: 'Aceptar'
          }).then(() => {this.onReload()});
        }
      });
  }

}
