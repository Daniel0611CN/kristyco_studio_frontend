// import { Component, inject, OnInit } from '@angular/core';
// import { PedidoService } from '../../../services/pedido.service';
// import { UsuarioService } from '../../../services/usuario.service';
// import { CommonModule } from '@angular/common';
// import { ColeccionService } from '../../../services/coleccion.service';
// import { Usuario } from '@app/models/interfaces/entities/usuario.interface';
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
//     console.log("a");
//     this.cargarDatosDelDashboard();
//     this.getPedidosEsteMes();
//   }

//   cargarDatosDelDashboard(): void {
//     this.getEstadisticasUsuarios();
//     this.getEstadisticasColecciones();
//   }

//   getPedidosEsteMes(): void {
//     this.pedidoService.getAllPedidos().subscribe((pedidos: Pedido[]) => {
//       console.log(pedidos.length);
//       for (const pedido of pedidos) {
//         console.log("bbb");
//         if (pedido.fecha) {
//           console.log("aa");
//           const dias = pedido.fecha.getUTCDay();
//           console.log(dias);
//         }
//       }
//     });
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
import { CommonModule, JsonPipe, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

import { UsuarioService } from '../../../services/usuario.service';
import { PedidoService } from '../../../services/pedido.service';
import { ColeccionService } from '../../../services/coleccion.service';
import { ProductoService } from '@app/services/invitacion.service';
import { Usuario } from '@app/models/interfaces/entities/usuario.interface';
import { Pedido } from '@app/models/interfaces/entities/pedido.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.component.html'
})
export class DashBoardComponent implements OnInit {
  // --- Servicios ---
  usuarioService = inject(UsuarioService);
  pedidoService = inject(PedidoService);
  coleccionService = inject(ColeccionService);
  productoService = inject(ProductoService);

  // --- Propiedades para Tarjetas ---
  totalUsuarios = 0;
  pedidosEsteMes = 0;
  invitacionesEnviadas = 0;
  coleccionesActivas = 0;
  mensajesUsuarios: string[] = [];

  // --- Propiedades para Gráficas Visuales ---
  barChartData: { month: string, count: number, height: number }[] = [];
  distributionData: { state: string, count: number, percentage: string, color: string }[] = [];

  // --- Actividad Reciente ---
  actividadReciente = [
    { fecha: new Date().toISOString(), descripcion: 'Nuevo pedido #1234 realizado por Ana Pérez.' },
    { fecha: new Date(Date.now() - 3600000).toISOString(), descripcion: 'Juan García ha actualizado su perfil.' },
  ];

  ngOnInit(): void {
    this.cargarDatosDelDashboard();
  }

  /**
   * Parsea una fecha en formato "DD-MM-YYYY" a un objeto Date de forma segura,
   * evitando problemas con zonas horarias que tiene new Date() por defecto.
   */
  private parsearFechaDDMMYYYY(fechaStr: string): Date {
    const parts = fechaStr.split('-'); // Divide "06-11-2005" en ["06", "11", "2005"]
    // new Date(año, mes - 1, día) -> El mes en JavaScript es 0-11
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }

  cargarDatosDelDashboard(): void {
    forkJoin({
      usuarios: this.usuarioService.getAll(),
      invitaciones: this.productoService.getAll(),
      colecciones: this.coleccionService.all(),
      pedidos: this.pedidoService.getAllPedidos()
    }).subscribe(({ usuarios, invitaciones, colecciones, pedidos }) => {
      this.totalUsuarios = usuarios.length;
      this.invitacionesEnviadas = invitaciones.length;
      this.coleccionesActivas = colecciones.length;
      this.procesarEstadisticasDePedidos(pedidos);
      this.generarMensajes(usuarios);
    });
  }

  private procesarEstadisticasDePedidos(pedidos: Pedido[]): void {
    const hoy = new Date();
    const inicioDeMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const anioActual = hoy.getFullYear();

    let contadorPedidosMes = 0;
    const distribucion: { [estado: string]: number } = {};
    const porMes: { [mes: number]: number } = {};

    for (const pedido of pedidos) {
      // Usamos nuestra función segura para parsear la fecha
      const fechaPedido = this.parsearFechaDDMMYYYY(pedido.fecha as unknown as string);

      // Comprobamos si la fecha del pedido está dentro del rango del mes actual
      if (fechaPedido >= inicioDeMes && fechaPedido <= hoy) {
        contadorPedidosMes++;
      }

      // Agrupamos para los gráficos
      distribucion[pedido.estado] = (distribucion[pedido.estado] || 0) + 1;
      if (fechaPedido.getFullYear() === anioActual) {
        const mes = fechaPedido.getMonth() + 1; // Enero = 1
        porMes[mes] = (porMes[mes] || 0) + 1;
      }
    }

    this.pedidosEsteMes = contadorPedidosMes;
    this.prepararDatosParaGraficos(distribucion, porMes, pedidos.length);
  }

  private prepararDatosParaGraficos(distribucion: { [k: string]: number }, porMes: { [k: number]: number }, totalPedidos: number) {
    // Preparar datos para gráfico de distribución
    const coloresEstado: { [key: string]: string } = {
        'PENDIENTE': '#e9c0a9', 'EN_CAMINO': '#707070', 'ENTREGADO': '#b0817e', 'CANCELADO': '#d9534f'
    };
    this.distributionData = Object.keys(distribucion).map(estado => ({
      state: estado,
      count: distribucion[estado],
      percentage: totalPedidos > 0 ? ((distribucion[estado] / totalPedidos) * 100).toFixed(1) : '0.0',
      color: coloresEstado[estado] || '#ccc'
    }));

    // Preparar datos para gráfico de barras
    const maxPedidosEnUnMes = Math.max(...Object.values(porMes), 0);
    const nombresMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    this.barChartData = Object.keys(porMes).map(mesKey => {
        const mesNumero = parseInt(mesKey);
        const count = porMes[mesNumero];
        return {
            month: nombresMeses[mesNumero - 1],
            count: count,
            height: maxPedidosEnUnMes > 0 ? (count / maxPedidosEnUnMes) * 100 : 0
        };
    });
  }

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
