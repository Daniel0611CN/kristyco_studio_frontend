import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductoService } from '@app/services/invitacion.service';
import { Producto } from '@app/models/interfaces/entities/producto.interface';

@Component({
  selector: 'app-invitacion',
  imports: [CommonModule],
  templateUrl: './invitacion.component.html'
})
export class InvitacionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productoService = inject(ProductoService);
  private readonly location = inject(Location);
  readonly destroyRef = inject(DestroyRef);

  readonly coleccionActual = signal<string>('');
  readonly productosFiltrados = signal<Producto[]>([]);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: ParamMap) => {
        const nombre = params.get('nombre')?.toLowerCase() ?? '';
        this.coleccionActual.set(nombre);
        console.log(nombre);

        this.productoService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(productos => {
        const items = Array.isArray(productos)
          ? productos
          : productos.content ?? [];

        const filtrados = items.filter((p: Producto) =>
          p.imagen?.toLowerCase().includes(`coleccion-${nombre}`) ||
          p.categoria?.nombre?.toLowerCase() === nombre
        );

        this.productosFiltrados.set(filtrados);
        console.log(this.productosFiltrados());
      });

      });
  }

  volver(): void {
    this.location.back();
  }
}
