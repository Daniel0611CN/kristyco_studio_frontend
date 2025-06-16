// import { Component, inject, OnInit } from '@angular/core';
// import { PedidoService } from '../../../services/pedido.service';
// import { UsuarioService } from '../../../services/usuario.service';
// import { CommonModule } from '@angular/common';
// import { ColeccionService } from '../../../services/coleccion.service';
// import { Usuario } from '@app/models/interfaces/entities/usuario.interface';

// @Component({
//   selector: 'app-dashboard',
//   imports: [CommonModule],
//   templateUrl: './dashboard.component.html'
// })
// export class DashBoardComponent implements OnInit {
//   usuarioService = inject(UsuarioService);
//   pedidoService = inject(PedidoService);
//   coleccionService = inject(ColeccionService);

//   totalUsuarios = 0;
//   pedidosEsteMes = 0;
//   invitacionesEnviadas = 0;
//   coleccionesActivas = 0;

//   mensajesUsuarios: string[] = [];

//   actividadReciente: { fecha: string; descripcion: string }[] = [
//     { fecha: new Date().toISOString(), descripcion: 'Nuevo pedido #1234 realizado por Ana Pérez.' },
//     { fecha: new Date(Date.now() - 3600000).toISOString(), descripcion: 'Juan García ha actualizado su perfil.' },
//     { fecha: new Date(Date.now() - 7200000).toISOString(), descripcion: 'Se ha registrado un nuevo usuario: marta.lopez@email.com' }
//   ];


//   ngOnInit(): void {
//     this.cargarDatosDelDashboard();
//   }

//   cargarDatosDelDashboard(): void {
//     this.getEstadisticasUsuarios();
//     this.getEstadisticasColecciones();
//   }

//   getEstadisticasUsuarios(): void {
//     this.usuarioService.getAll().subscribe((usuarios) => {
//       this.totalUsuarios = usuarios.length;

//       const totalConfirmados = usuarios.filter((u: Usuario) => u.enabled).length;
//       const totalNoConfirmados = this.totalUsuarios - totalConfirmados;

//       this.mensajesUsuarios = [
//         this.generarMensajeUsuario(totalConfirmados, 'confirmado su cuenta'),
//         this.generarMensajeUsuario(totalNoConfirmados, 'no ha confirmado su cuenta')
//       ];
//     });
//   }

//   private generarMensajeUsuario(cantidad: number, accion: string): string {
//     if (cantidad === 0) {
//       return `No hay usuarios que hayan ${accion}.`;
//     }
//     if (cantidad === 1) {
//       return `Hay 1 usuario que ha ${accion}.`;
//     }
//     return `Hay ${cantidad} usuarios que han ${accion}.`;
//   }

//   getEstadisticasColecciones(): void {
//     this.coleccionService.all().subscribe((colecciones) => {
//       this.coleccionesActivas = colecciones.length;
//     });
//   }
// }

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule para el @for de mensajes
import { forkJoin } from 'rxjs';

// Tus servicios
import { UsuarioService } from '../../../services/usuario.service';
import { PedidoService } from '../../../services/pedido.service';
import { ColeccionService } from '../../../services/coleccion.service';
import { ProductoService } from '@app/services/invitacion.service';

// Tus interfaces
import { Usuario } from '@app/models/interfaces/entities/usuario.interface';
import { Pedido } from '@app/models/interfaces/entities/pedido.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashBoardComponent implements OnInit {
  // --- Inyección de Servicios ---
  usuarioService = inject(UsuarioService);
  pedidoService = inject(PedidoService);
  coleccionService = inject(ColeccionService);
  productoService = inject(ProductoService);

  // --- Propiedades para las Tarjetas (solo las que nos importan ahora) ---
  totalUsuarios = 0;
  pedidosEsteMes = 0; // <-- ¡ESTA ES LA PROPIEDAD CLAVE!
  invitacionesEnviadas = 0;
  coleccionesActivas = 0;

  // Propiedades para mensajes de usuario (esto ya funcionaba bien)
  mensajesUsuarios: string[] = [];

  // La actividad reciente la dejamos como estaba
  actividadReciente = [
    { fecha: new Date().toISOString(), descripcion: 'Nuevo pedido #1234 realizado por Ana Pérez.' }
  ];

  ngOnInit(): void {
    this.cargarDatosDelDashboard();
  }

  /**
   * Esta función es la única que lee la fecha y es la clave del arreglo.
   * Convierte el texto "DD-MM-YYYY" en una fecha real que JavaScript entiende.
   */
  private parsearFechaDDMMYYYY(fechaStr: string): Date {
    const parts = fechaStr.split('-');
    console.log(parts);
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }

  cargarDatosDelDashboard(): void {
    // forkJoin para traer todos los datos a la vez
    forkJoin({
      usuarios: this.usuarioService.getAll(),
      invitaciones: this.productoService.getAll(),
      colecciones: this.coleccionService.all(),
      pedidos: this.pedidoService.getAllPedidos()
    }).subscribe(({ usuarios, invitaciones, colecciones, pedidos }) => {

      // Calculamos los totales simples
      this.totalUsuarios = usuarios.length;
      this.invitacionesEnviadas = invitaciones.length;
      this.coleccionesActivas = colecciones.length;
      this.generarMensajes(usuarios);

      // --- AQUÍ VIENE EL CÁLCULO QUE NOS INTERESA ---
      const hoy = new Date();
      // Definimos el rango: desde el primer día del mes actual...
      const inicioDeMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

      let contador = 0;
      for (const pedido of pedidos) {
        // 1. Convertimos la fecha del pedido usando nuestra función
        const fechaPedido = this.parsearFechaDDMMYYYY(pedido.fecha as unknown as string);

        // 2. Comprobamos si la fecha del pedido está en el rango de este mes
        if (fechaPedido >= inicioDeMes && fechaPedido <= hoy) {
          contador++;
          // Para que veas qué pedidos está contando, puedes descomentar la siguiente línea:
          // console.log('Contando pedido:', pedido.id, 'con fecha:', fechaPedido.toLocaleDateString());
        }
      }

      // 3. Asignamos el resultado final a nuestra propiedad
      this.pedidosEsteMes = contador;
    });
  }

  // Las funciones de mensajes no cambian
  private generarMensajes(usuarios: Usuario[]): void {
    const confirmados = usuarios.filter(u => u.enabled).length;
    this.mensajesUsuarios = [
      this.generarMensajeUsuario(confirmados, 'confirmado su cuenta'),
      this.generarMensajeUsuario(this.totalUsuarios - confirmados, 'no ha confirmado su cuenta')
    ];
  }

  private generarMensajeUsuario(cantidad: number, accion: string): string {
    if (cantidad === 0) return `No hay usuarios que hayan ${accion}.`;
    if (cantidad === 1) return `Hay 1 usuario que ha ${accion}.`;
    return `Hay ${cantidad} usuarios que han ${accion}.`;
  }
}
