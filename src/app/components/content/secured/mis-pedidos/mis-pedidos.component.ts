import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { PedidoService } from '@app/services/pedido.service';
import { AuthService } from '@app/services/auth.service';
import { Pedido } from '@app/models/interfaces/entities/pedido.interface';
import { StorageService } from '@app/components/shared/services/storage.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './mis-pedidos.component.html',
})
export class MisPedidosComponent implements OnInit {
  pedidoService = inject(PedidoService);
  authService = inject(AuthService);
  storageService = inject(StorageService);

  pedidos: Pedido[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    console.log(this.storageService.getUser)
    const usuarioId = this.storageService.getUser().id || 1;

    this.isLoading = true;
    this.pedidoService.pedidosPorUsuario(usuarioId).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los pedidos:', err);
        this.isLoading = false;
      }
    });
  }

  getBadgeColor(estado: string): string {
    switch (estado) {
      case 'ENTREGADO':
        return 'bg-success';
      case 'EN_CAMINO':
        return 'bg-info';
      case 'PENDIENTE':
        return 'bg-warning text-dark';
      case 'CANCELADO':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
