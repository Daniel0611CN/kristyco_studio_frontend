import { Component, inject, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ColeccionService } from '../../../services/coleccion.service';
import { Usuario } from '@app/models/interfaces/entities/usuario.interface';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashBoardComponent implements OnInit {
  usuarioService = inject(UsuarioService);
  pedidoService = inject(PedidoService);
  coleccionService = inject(ColeccionService);

  totalUsuarios = 0;
  pedidosEsteMes = 0;
  invitacionesEnviadas = 0;
  coleccionesActivas = 0;

  mensajesUsuarios: string[] = [];

  actividadReciente: { fecha: string; descripcion: string }[] = [
    { fecha: new Date().toISOString(), descripcion: 'Nuevo pedido #1234 realizado por Ana Pérez.' },
    { fecha: new Date(Date.now() - 3600000).toISOString(), descripcion: 'Juan García ha actualizado su perfil.' },
    { fecha: new Date(Date.now() - 7200000).toISOString(), descripcion: 'Se ha registrado un nuevo usuario: marta.lopez@email.com' }
  ];


  ngOnInit(): void {
    this.cargarDatosDelDashboard();
  }

  cargarDatosDelDashboard(): void {
    this.getEstadisticasUsuarios();
    this.getEstadisticasColecciones();
  }

  getEstadisticasUsuarios(): void {
    this.usuarioService.getAll().subscribe((usuarios) => {
      this.totalUsuarios = usuarios.length;

      const totalConfirmados = usuarios.filter((u: Usuario) => u.enabled).length;
      const totalNoConfirmados = this.totalUsuarios - totalConfirmados;

      this.mensajesUsuarios = [
        this.generarMensajeUsuario(totalConfirmados, 'confirmado su cuenta'),
        this.generarMensajeUsuario(totalNoConfirmados, 'no ha confirmado su cuenta')
      ];
    });
  }

  private generarMensajeUsuario(cantidad: number, accion: string): string {
    if (cantidad === 0) {
      return `No hay usuarios que hayan ${accion}.`;
    }
    if (cantidad === 1) {
      return `Hay 1 usuario que ha ${accion}.`;
    }
    return `Hay ${cantidad} usuarios que han ${accion}.`;
  }

  getEstadisticasColecciones(): void {
    this.coleccionService.all().subscribe((colecciones) => {
      this.coleccionesActivas = colecciones.length;
    });
  }
}
