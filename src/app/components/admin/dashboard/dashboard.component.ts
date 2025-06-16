import { Component, inject, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ColeccionService } from '../../../services/coleccion.service';
import { Usuario } from '@app/models/interfaces/entities/usuario.interface';
import { Pedido } from '@app/models/interfaces/entities/pedido.interface';

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
    console.log("a");
    this.cargarDatosDelDashboard();
    this.getPedidosEsteMes();
  }

  cargarDatosDelDashboard(): void {
    this.getEstadisticasUsuarios();
    this.getEstadisticasColecciones();
  }

  getPedidosEsteMes(): void {
    this.pedidoService.getAllPedidos().subscribe((pedidos: Pedido[]) => {
      console.log("cccc");
      for (const pedido of pedidos) {
        console.log("bbb");
        if (pedido.fecha) {
          console.log("aa");
          const dias = pedido.fecha.getUTCDay();
          console.log(dias);
        }
      }
    });
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


// import { Component, inject, OnInit } from '@angular/core';
// import { PedidoService } from '../../../services/pedido.service';
// import { UsuarioService } from '../../../services/usuario.service';
// import { CommonModule } from '@angular/common';
// import { ColeccionService } from '../../../services/coleccion.service';
// import { Usuario } from '@app/models/interfaces/entities/usuario.interface';

// // --- ADICIONES ---
// import { ProductoService } from '@app/services/invitacion.service';
// import { Pedido } from '@app/models/interfaces/entities/pedido.interface';

// @Component({
//   selector: 'app-dashboard',
//   imports: [CommonModule],
//   templateUrl: './dashboard.component.html'
// })
// export class DashBoardComponent implements OnInit {
//   usuarioService = inject(UsuarioService);
//   pedidoService = inject(PedidoService);
//   coleccionService = inject(ColeccionService);
//   // --- ADICIÓN ---
//   productoService = inject(ProductoService); // Inyectamos el servicio de productos

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
//     // --- ADICIONES ---
//     this.getEstadisticasInvitaciones(); // Llamamos a la nueva función
//     this.getEstadisticasPedidos();     // Llamamos a la nueva función
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

//   // --- NUEVA FUNCIÓN AÑADIDA ---
//   getEstadisticasInvitaciones(): void {
//     // Asumimos que tienes un método getAll() que devuelve un array de productos
//     this.productoService.getAll().subscribe((invitaciones) => {
//       this.invitacionesEnviadas = invitaciones.length;
//     });
//   }

//   // --- NUEVA FUNCIÓN AÑADIDA CON TU LÓGICA EXACTA ---
//   getEstadisticasPedidos(): void {
//     // Asumimos que tienes un método getAllPedidos() que devuelve un array de pedidos
//     this.pedidoService.getAllPedidos().subscribe((pedidos: Pedido[]) => {

//       // 1. Obtenemos el día, mes y año de HOY
//       const hoy = new Date();
//       const diaActual = hoy.getDate();         // Ejemplo: 17
//       const mesActual = hoy.getMonth() + 1;    // Ejemplo: 6 (porque getMonth() es 0-11)
//       const anioActual = hoy.getFullYear();    // Ejemplo: 2025

//       let contador = 0;
//       for (const pedido of pedidos) {
//         // 2. Extraemos las partes de la fecha del pedido (que viene como "DD-MM-YYYY")
//         const fechaPedidoStr = pedido.fecha as unknown as string;
//         const parts = fechaPedidoStr.split('-');
//         const diaPedido = Number(parts[0]);
//         const mesPedido = Number(parts[1]);
//         const anioPedido = Number(parts[2]);

//         // 3. Aplicamos la regla EXACTA que me has dicho:
//         //    Mismo mes Y mismo año Y el día del pedido es menor o igual al día actual.
//         if (mesPedido === mesActual && anioPedido === anioActual && diaPedido <= diaActual) {
//           contador++;
//         }
//       }

//       this.pedidosEsteMes = contador;
//     });
//   }
// }
