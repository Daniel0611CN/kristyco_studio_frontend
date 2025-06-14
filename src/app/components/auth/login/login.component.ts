import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../shared/services/storage.service';
import { TokenService } from '../../../services/token.service';
import { ERol } from '../../../models/enums/rol.enum';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../shared/services/swal.service';

declare function initTooltips(): void;

interface LoginUser {
  id: number;
  enabled: boolean;
  email: string;
  roles: ERol[];
  token: string;
  username: string;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  storageService = inject(StorageService);
  authService = inject(AuthService);
  cd = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);
  router = inject(Router);
  httpClient = inject(HttpClient);
  tokenService = inject(TokenService);
  swalService = inject(SwalService);

  loginForm: FormGroup;

  resetEmailForm: FormGroup;

  user = signal<LoginUser>({ id: 0, enabled: false, email: '', roles: [], token: '', username: '' })
  showPassword = signal<boolean>(false);
  showForm = signal<boolean>(true);
  errMsg = signal<string>('');

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
    this.resetEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\\.com$')]]
    })
    setTimeout(() => initTooltips(), 0);
  }

  ngOnInit(): void {
    if (localStorage.getItem('Confirm-Token-Registered')) {
      this.showForm.set(false);
      this.swalService.showSuccess('Cuenta confirmada', 'Tu cuenta ha sido confirmada correctamente. Ya puedes iniciar sesión.');
      localStorage.removeItem('Confirm-Token-Registered');
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { username, password, rememberMe } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (user: LoginUser) => this.handleSuccesfullLogin(user, rememberMe),
      error: err => this.handleErrorLogin(err)
    });
  }

  private handleSuccesfullLogin(user: LoginUser, rememberMe: boolean): void {
    this.storageService.saveUser(user, rememberMe);
    this.user.set(user);
    this.showForm.set(false);
    this.swalService.showSuccess('Inicio de sesión exitoso', `¡Bienvenido ${user.username}! Redirigiendo...`, 1000, false).then(() => {
      this.router.navigateByUrl(this.user().roles.includes(ERol.ROL_ADMIN) ? '/admin' : '/home');
    });
  }

  private handleErrorLogin(err: any): void {
    this.errMsg.set(err?.error?.message);
    this.showForm.set(false);

    if (this.errMsg().includes('contraseña')) this.swalService.showError('Contraseña incorrecta', this.errMsg()).then(() => this.onReload());
    else if (this.errMsg().includes('correo')) this.warningLogin();
    else if (this.errMsg().includes('usuario')) this.swalService.showError('Cuenta inexistente', this.errMsg()).then(() => this.onReload());
    else this.swalService.showError('Error desconocido', 'Error interno del sistema, inténtelo de nuevo o contacte al soporte.').then(() => this.onReload());
  }

  private warningLogin(): void {
    this.swalService.showWarning('Cuenta deshabilitada', 'Reenviar correo', `<p>${this.errMsg()}</p><p>¿Quieres reenviar el correo de confirmación?</p>`).then(result => {
      if (result.isConfirmed) {
        this.resendToken();
      } else {
        this.onReload();
      }
    });
  }

  resendToken() {
    this.tokenService.resendConfirmationToken(this.username?.value).subscribe({
      next: () => this.swalService.showSuccess('Correo enviado', 'Correo de confirmación reenviado correctamente. Revisa tu bandeja de entrada.', 0, true).then(() => this.onReload()),
      error: () => this.swalService.showError('Error', 'No se pudo reenviar el correo. Verifica si tu cuenta ya está activada o si el token sigue vigente.').then(() => this.onReload())
    });
  }

  onReload(): void {
    this.showForm.set(true);
    this.cd.detectChanges();
    setTimeout(() => initTooltips(), 0);
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
  get email() { return this.resetEmailForm.get('email'); }

  onPasswordReset() {
    this.showForm.set(false);

    if (!this.email) return;

    this.tokenService.requestResetPassword(this.email?.value).subscribe({
      next: () => this.swalService.showSuccess('Correo enviado', 'Se ha enviado el enlace de restablecimiento. Revisa tu correo.').then(() => this.onReload()),
      error: (err) => this.swalService.showError('Error', err.error.message || 'No se pudo enviar el correo. Inténtelo de nuevo.')
    });
  }

}
