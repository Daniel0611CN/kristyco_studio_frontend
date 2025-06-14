import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../../models/interfaces/entities/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';
import { StorageService } from '../../shared/services/storage.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '@env/environment';
import { SwalService } from '@app/components/shared/services/swal.service';

declare var bootstrap: any;

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit, AfterViewInit {
  usuarioService = inject(UsuarioService);
  storageService = inject(StorageService);
  swalService = inject(SwalService);
  http = inject(HttpClient);
  fb = inject(FormBuilder);

  usuario: Usuario = {
    id: '', nombre: '', apellido1: '', apellido2: '',
    email: '', telefono: '', direccion: '', enabled: false
  };

  showPassword = false;
  showNewPassword = false;
  showRepeatPassword = false;
  passwordForm: FormGroup;

  private passwordModal: any;

  constructor() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.usuarioService.get(this.storageService.getUser().id).subscribe((usuario: Usuario) => {
      this.usuario = usuario;
    });
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('passwordChangeModal');
    if (modalElement) {
      this.passwordModal = new bootstrap.Modal(modalElement);
    }
  }

  cambiarPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.swalService.showWarning('¿Estás seguro?', 'Sí, cambiar', 'Vas a cambiar tu contraseña actual.')
      .then((result) => {
        if (result.isConfirmed) {
          const newPassword = this.newPassword?.value;
          const body = { newPassword: newPassword };

          this.http.put(`${environment.apiUrl}/usuarios/password`, body)
            .subscribe({
              next: () => {
                this.passwordModal?.hide();
                this.swalService.showSuccess('¡Éxito!', 'Tu contraseña ha sido cambiada correctamente.');
                this.passwordForm.reset();
              },
              error: (err) => {
                console.error('Error al cambiar la contraseña', err);
                this.swalService.showError('Error', 'No se pudo cambiar la contraseña. Por favor, inténtalo de nuevo.');
              }
            });
        }
      });
  }

  get hasLength(): boolean {
    const val = this.newPassword?.value || '';
    return val.length >= 8 && val.length <= 20;
  }

  get hasLowercase(): boolean {
    const value = this.newPassword?.value || '';
    return (value.match(/[a-z]/g) || []).length >= 3;
  }

  get hasUppercase(): boolean {
    const value = this.newPassword?.value || '';
    return (value.match(/[A-Z]/g) || []).length >= 2;
  }

  get hasNumber(): boolean {
    const value = this.newPassword?.value || '';
    return (value.match(/[0-9]/g) || []).length >= 2;
  }

  get hasSpecialChar(): boolean {
    const value = this.newPassword?.value || '';
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

  get oldPassword() { return this.passwordForm.get('oldPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get repeatPassword() { return this.passwordForm.get('repeatPassword'); }

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleNewPassword(): void { this.showNewPassword = !this.showNewPassword; }
  toggleRepeatPassword(): void { this.showRepeatPassword = !this.showRepeatPassword; }

  validateOldPassword(): void {
    const oldPassword = this.oldPassword?.value;
    if (!oldPassword) return;

    this.http.post<{ valid: boolean }>(`${environment.apiUrl}/confirmation_token/validate-old-password`, { oldPassword })
      .subscribe({
        next: res => {
          if (!res.valid) {
            this.oldPassword?.setErrors({ incorrect: true });
          } else {
            this.oldPassword?.setErrors(null);
          }
        },
        error: () => {
          this.oldPassword?.setErrors({ incorrect: true });
        }
      });
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassControl = group.get('newPassword');
    const repeatPassControl = group.get('repeatPassword');

    if (!newPassControl || !repeatPassControl) {
      return null;
    }

    if (repeatPassControl.value && newPassControl.value !== repeatPassControl.value) {
      repeatPassControl.setErrors({ ...repeatPassControl.errors, mismatch: true });
    } else {
      if (repeatPassControl.hasError('mismatch')) {
        const errors = { ...repeatPassControl.errors };
        delete errors['mismatch'];
        repeatPassControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    }

    return null;
  }

  eliminarUsuario(): void {
    this.swalService.showWarning(
      '¿Eliminar cuenta?',
      'Sí, eliminar',
      'Esta acción no se puede deshacer. Todos tus datos se perderán permanentemente.'
    ).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.apiUrl}/usuarios/${this.usuario.id}`).subscribe({
          next: () => {
            this.swalService.showSuccess('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente.');
            this.storageService.logout();
          },
          error: (err) => {
            console.error('Error al eliminar el usuario', err);
            this.swalService.showError('Error', 'No se pudo eliminar tu cuenta.');
          }
        });
      }
    });
  }
}

