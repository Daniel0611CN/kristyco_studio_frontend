import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PedidoService } from '../../../services/pedido.service';
import { SwalService } from '../../shared/services/swal.service';
import { StorageService } from '../../shared/services/storage.service';
import { ProductoService } from '@app/services/invitacion.service';

import { Pedido } from '../../../models/interfaces/entities/pedido.interface';
import { Producto } from '@app/models/interfaces/entities/producto.interface';

@Component({
  selector: 'app-realizar-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './realizar-pedido.component.html',
})
export class RealizarPedidoComponent implements OnInit {

  fb = inject(FormBuilder);
  pedidoService = inject(PedidoService);
  swalService = inject(SwalService);
  router = inject(Router);
  productoService = inject(ProductoService);
  storageService = inject(StorageService);

  pedidoForm!: FormGroup;
  cargando = false;

  listaInvitaciones: Producto[] = [];

  constructor() {
    this.pedidoForm = this.fb.group({
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      productoIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarInvitaciones();
  }

  cargarInvitaciones(): void {
    this.productoService.getAll().subscribe({
      next: (invitaciones) => this.listaInvitaciones = invitaciones,
      error: () => this.swalService.showError('Error', 'No se pudieron cargar los productos.')
    });
  }

  onSubmit(): void {
    if (this.pedidoForm.invalid) {
      this.pedidoForm.markAllAsTouched();
      return;
    }

    this.cargando = true;

    const usuarioLogueado = this.storageService.getUser();

    if (!usuarioLogueado || !usuarioLogueado.id) {
        this.cargando = false;
        this.swalService.showError('Error de Autenticación', 'No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.');
        return;
    }

    const selectedIds = this.pedidoForm.value.productoIds as number[];
    const selectedProducts = this.listaInvitaciones.filter(p => selectedIds.includes(p.id));
    const costeProductos = selectedProducts.reduce((acc, current) => acc + current.precio, 0);

    const COSTE_ENVIO = 5.99;
    const costeTotal = costeProductos + COSTE_ENVIO;

    const nuevoPedido: Pedido = {
      ...this.pedidoForm.value,
      usuario: { id: usuarioLogueado.id },
      pago: {
        metodo: 'TARJETA',
        monto: costeTotal,
        estado: 'PENDIENTE'
      },
      costeEnvio: COSTE_ENVIO,
      total: costeTotal,
      estado: 'PENDIENTE'
    };

    this.pedidoService.create(nuevoPedido).subscribe({
      next: (pedidoCreado) => {
        this.router.navigate(['/paypal', pedidoCreado.id]);
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al crear el pedido', err);
        this.swalService.showError(
          'Error Inesperado',
          'No se pudo procesar tu pedido. Por favor, inténtalo de nuevo.'
        );
      }
    });
  }
}
