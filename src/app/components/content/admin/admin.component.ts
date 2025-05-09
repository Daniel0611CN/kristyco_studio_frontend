import { Component, inject, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ColeccionService } from '../../../services/coleccion.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  usuarios: any[] = [];
  totalUsuarios: number = 0;
  totalUsuariosConfirmados: number = 0;
  totalUsuariosNoConfirmados: number = 0;
  pedidosEsteMes: number = 0;
  invitacionesEnviadas: number = 0;
  coleccionesActivas: number = 0;

  actividadReciente: { fecha: string; descripcion: string }[] = [];

  coleccionService = inject(ColeccionService);
  usuarioService = inject(UsuarioService);
  pedidoService = inject(PedidoService);

  ngOnInit(): void {
    this.getTotalUsuarios();
    this.getColeccionesActivas();
  }

  getTotalUsuarios() {
    this.usuarioService.getAll().subscribe((usuarios) => {
      this.totalUsuarios = usuarios.length;
      this.usuarios = usuarios;
      this.usuarios.forEach((usuario) => {
        if (usuario.enabled) {
          this.totalUsuariosConfirmados++;
        } else {
          this.totalUsuariosNoConfirmados++;
        }
      });
    });
  }

  getColeccionesActivas() {
    this.coleccionService.all().subscribe((colecciones) => {
      this.coleccionesActivas = colecciones.length;
    });
  }

}
