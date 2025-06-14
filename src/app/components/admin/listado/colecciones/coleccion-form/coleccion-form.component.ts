import { Component, computed, effect, inject, input, output, InputSignal, OutputEmitterRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Coleccion {
  id: number;
  nombre: string;
  descripcion?: string;
}

@Component({
  selector: 'app-coleccion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coleccion-form.component.html',
})
export class ColeccionFormComponent {
  private fb = inject(FormBuilder);

  public coleccion: InputSignal<Coleccion | null> = input.required<Coleccion | null>();
  public save: OutputEmitterRef<Partial<Coleccion>> = output<Partial<Coleccion>>();

  public form: FormGroup = this.fb.group({
    id: [null],
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    descripcion: ['']
  });

  public isEditMode = computed(() => !!this.coleccion());
  public formTitle = computed(() => this.isEditMode() ? 'Editar Colección' : 'Crear Colección');

  get nombre() { return this.form.get('nombre'); }

  constructor() {
    effect(() => {
      const coleccionData = this.coleccion();
      if (coleccionData) {
        this.form.patchValue({
          id: coleccionData.id,
          nombre: coleccionData.nombre,
          descripcion: coleccionData.descripcion ?? ''
        });
      } else {
        this.form.reset();
      }
    });
  }

  public submitForm(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
