import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Producto } from '@interfaces/entities/producto.interface';
import { Categoria } from '@interfaces/entities/categoria.interface';
import { Proveedor } from '@interfaces/entities/proveedor.interface';

@Component({
  selector: 'app-invitacion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invitacion-form.component.html',
})
export class InvitacionFormComponent {
  mode = input.required<'crear' | 'editar'>();
  formData = input<Partial<Producto | null >>();
  categorias = input.required<Categoria[]>();
  proveedores = input.required<Proveedor[]>();
  formSubmit = output<Producto>();
  cancel = output<void>();

  private fb = inject(FormBuilder);

  protected productoForm: FormGroup;
  protected title = '';
  protected submitButtonText = '';

  constructor() {
    this.productoForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imagen: [''],
      categoriaId: [null, Validators.required],
      proveedorId: [null, Validators.required]
    });

    effect(() => {
      this.updateFormState();
    });
  }

  private updateFormState(): void {
    const currentMode = this.mode();
    const data = this.formData();

    this.title = currentMode === 'crear' ? 'Crear Nuevo Producto' : `Editar Producto ${data?.id}`;
    this.submitButtonText = currentMode === 'crear' ? 'Guardar' : 'Actualizar Cambios';

    if (currentMode === 'editar' && data) {
      this.productoForm.patchValue({
        ...data,
        categoriaId: data.categoria?.id ?? null,
        proveedorId: data.proveedor?.id ?? null
      });
    } else {
      this.productoForm.reset({
        precio: 0,
        stock: 0
      });
    }
  }

  protected onSubmit(): void {
    if (this.productoForm.valid) {
      const formValue = this.productoForm.value;
      const producto: Producto = {
        ...formValue,
        categoria: { id: formValue.categoriaId },
        proveedor: { id: formValue.proveedorId }
      };
      delete (producto as any).categoriaId;
      delete (producto as any).proveedorId;
      this.formSubmit.emit(producto);
    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  get nombre() { return this.productoForm.get('nombre'); }
  get precio() { return this.productoForm.get('precio'); }
  get stock() { return this.productoForm.get('stock'); }
  get imagen() { return this.productoForm.get('imagen'); }
  get categoriaId() { return this.productoForm.get('categoriaId'); }
  get proveedorId() { return this.productoForm.get('proveedorId'); }
}
