import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaypalResponse } from '../../../../models/interfaces/paypalResponse.interface';
import { PedidoService } from '../../../../services/pedido.service';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SwalService } from '../../services/swal.service';
import { environment } from '@env/environment';

const channel = new BroadcastChannel('succes-paypal-channel');

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paypal.component.html'
})
export class PaypalComponent implements OnInit {

  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  pedidoService = inject(PedidoService);
  swalService = inject(SwalService);
  cd = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);

  cancelado: boolean = false;
  procesando: boolean = false;
  showFormPaypal: boolean = true;
  urlApproval: string = '';

  pedidoId: string | null = null;
  paypalOrderId: string = '';

  paypalForm: FormGroup = this.fb.group({
    method: ['Paypal', Validators.required],
    amount: [{ value: '', disabled: true }, Validators.required],
    currency: ['EUR', Validators.required],
    description: ['Pedido de invitaciones', Validators.required],
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pedidoId = id;
        this.pedidoService.get(id).subscribe({
          next: (pedido) => {
            if (pedido?.pago?.monto) {
              this.paypalForm.patchValue({ amount: pedido.pago.monto.toFixed(2) });
            } else {
              this.swalService.showError('Error', 'No se pudo cargar la información del pedido.');
              this.router.navigateByUrl('/perfil');
            }
          },
          error: (err) => {
            console.error("Error al obtener el pedido:", err);
            this.swalService.showError('Error', 'El pedido no existe o no se pudo encontrar.');
            this.router.navigateByUrl('/perfil');
          }
        });
      } else {
        console.error("No se ha proporcionado un ID de pedido en la URL.");
        this.router.navigateByUrl('/perfil');
      }
    });

    channel.onmessage = (event) => {
      if (event.data.message === 'successPaypal') {
        this.polling(this.paypalOrderId);
      } else if (event.data.message === 'cancelPaypal') {
        this.procesando = false;
        this.showFormPaypal = false;
        this.cancelado = true;
        this.cd.detectChanges();
      }
    };
  }

  onSubmit() {
    if (this.paypalForm.invalid) return;

    this.http.post<PaypalResponse>(`${environment.apiUrl}/payment/create`, this.paypalForm.getRawValue()).subscribe((data) => {
      if (data.href) {
        this.procesando = true;
        this.showFormPaypal = false;
        this.paypalOrderId = data.orderId;
        window.open(data.href, "popup", "width=600,height=800");
      }
    });
  }

  sendPolling(orderId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/payment/success`, { params: { orderId } });
  }

  onClose() {
    this.router.navigate(['/perfil']);
  }

  polling(orderId: string) {
    this.sendPolling(orderId).subscribe((data: any) => {
      if (data["state"] == "APPROVED") {
        this.showFormPaypal = false;
        this.procesando = false;
        this.cancelado = false;
        this.cd.detectChanges();
      } else {
        setTimeout(() => { this.polling(orderId) }, 2000);
      }
    });
  }
}
