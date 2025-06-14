import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  showSuccess(title: string, message: string, timer?: number, showConfirmationButton?: boolean, confirmButtonText?: string) {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      timer: timer,
      showConfirmButton: showConfirmationButton,
      confirmButtonText: confirmButtonText
    });
  }

  showWarning(title: string, confirmButtonText: string, html?: string) {
    return Swal.fire({
      icon: 'warning',
      title: title,
      html: html,
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    });
  }

  showError(title: string, message: string) {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar'
    });
  }

}
