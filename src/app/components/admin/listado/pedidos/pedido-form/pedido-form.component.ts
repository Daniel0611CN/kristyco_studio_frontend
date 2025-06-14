import { Component, effect, inject, input, Output, EventEmitter, InputSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../../../services/pedido.service';
import { SwalService } from '../../../../shared/services/swal.service';
import { Pedido } from '../../../../../models/interfaces/entities/pedido.interface';
import { EstadoPagoPipe } from '@pipes/estadoPago.pipe';
import { MetodoPagoPipe } from '@pipes/metodoPago.pipe';

interface FormField {
  col?: boolean;
  key: string;
  label: string;
  span?: string;
  type?: string;
  readonly?: boolean;
  options?: { value: string; label: string; }[];
}

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EstadoPagoPipe, MetodoPagoPipe],
  templateUrl: './pedido-form.component.html'
})
export class PedidoFormComponent {
  private fb = inject(FormBuilder);
  private swalService = inject(SwalService);
  private pedidoService = inject(PedidoService);

  public pedido: InputSignal<Pedido | null> = input.required<Pedido | null>();
  @Output() formSaved = new EventEmitter<Pedido>();

  public editForm: FormGroup;
  private originalItem: Pedido | null = null;

  public formFields: FormField[] = [
    { col: true, key: 'total', label: 'Coste Total', span: '€', type: 'number' },
    { col: true, key: 'costeEnvio', label: 'Coste de Envío', span: '€', type: 'number' },
    { key: 'fecha', label: 'Fecha de Registro', type: 'text', readonly: true },
    { key: 'direccion', label: 'Dirección', type: 'text', readonly: true },
    { key: 'estado', label: 'Estado de Envío', options: [
        { value: 'PENDIENTE', label: 'Pendiente' },
        { value: 'EN_CAMINO', label: 'En Camino' },
        { value: 'ENTREGADO', label: 'Entregado' },
        { value: 'CANCELADO', label: 'Cancelado' }
      ]
    },
    { key: 'usuario', label: 'Usuario', readonly: true },
    { col: true, key: 'metodoPago', label: 'Método de Pago', readonly: true },
    { col: true, key: 'estadoPago', label: 'Estado del Pago', readonly: true },
    { key: 'productos', label: 'Productos', readonly: true }
  ];

  constructor() {
    this.editForm = this.fb.group({
      total: [0, [Validators.required, Validators.min(0)]],
      costeEnvio: [0, [Validators.required, Validators.min(0)]],
      fecha: [''],
      direccion: [''],
      estado: ['', Validators.required],
      usuario: [''],
      metodoPago: [''],
      estadoPago: [''],
      productos: [[]]
    });

    effect(() => {
      const currentPedido = this.pedido();
      if (currentPedido) {
        this.originalItem = structuredClone(currentPedido);
        this.buildForm(currentPedido);
      }
    });
  }

  private buildForm(data: Pedido): void {
    this.editForm.patchValue({
      total: data.total ?? 0,
      costeEnvio: data.costeEnvio ?? 0,
      fecha: data.fecha ? new Date(data.fecha).toLocaleDateString() : '',
      direccion: data.direccion ?? '',
      estado: data.estado ?? '',
      usuario: `${data.usuario?.nombre ?? ''} ${data.usuario?.apellido1 ?? ''} ${data.usuario?.apellido2 ?? ''}`.trim(),
      metodoPago: data.pago?.metodo ?? '',
      estadoPago: data.pago?.estado ?? '',
      productos: data.productos ?? []
    });
  }

  public get formControl() {
    return this.editForm.controls;
  }

  public guardarCambios(): void {
    if (!this.editForm.valid || !this.originalItem) return;

    const updatedPedido: Pedido = {
      ...this.originalItem,
      id: this.originalItem.id,
      total: this.editForm.value.total,
      costeEnvio: this.editForm.value.costeEnvio,
      estado: this.editForm.value.estado
    };
    this.pedidoService.update(updatedPedido.id, updatedPedido).subscribe({
      next: () => {
        this.closeModal();
        this.formSaved.emit(updatedPedido);
        this.swalService.showSuccess('Éxito', 'Se ha editado el pedido correctamente.', 1000);
      },
      error: (err) => console.error('Error al actualizar el pedido', err)
    });
  }

  public cancelarEdicion(): void {
    if (this.originalItem) {
      this.buildForm(this.originalItem);
    }
  }

  private closeModal(): void {
    const closeBtn = document.querySelector('#exampleModalVer .btn-close') as HTMLElement;
    closeBtn?.click();
  }
}
