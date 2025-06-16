// import { Component, inject, OnInit } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { forkJoin } from 'rxjs';

// import { UsuarioService } from '../../../services/usuario.service';
// import { PedidoService } from '../../../services/pedido.service';
// import { ColeccionService } from '../../../services/coleccion.service';
// import { Usuario } from '@app/models/interfaces/entities/usuario.interface';
// import { Pedido } from '@app/models/interfaces/entities/pedido.interface';
// import { ProductoService } from '@app/services/invitacion.service';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, DatePipe],
//   templateUrl: './dashboard.component.html'
//   // El bloque de 'styles' se ha eliminado
// })
// export class DashBoardComponent implements OnInit {
//   usuarioService = inject(UsuarioService);
//   pedidoService = inject(PedidoService);
//   coleccionService = inject(ColeccionService);
//   productoService = inject(ProductoService);

//   totalUsuarios = 0;
//   pedidosEsteMes = 0;
//   invitacionesEnviadas = 0;
//   coleccionesActivas = 0;
//   mensajesUsuarios: string[] = [];

//   barChartData: { month: string, count: number, height: number }[] = [];
//   distributionData: { state: string, count: number, percentage: string, color: string }[] = [];

//   actividadReciente = [
//     { fecha: new Date().toISOString(), descripcion: 'Nuevo pedido #1234 realizado por Ana Pérez.' },
//     { fecha: new Date(Date.now() - 3600000).toISOString(), descripcion: 'Juan García ha actualizado su perfil.' },
//   ];

//   ngOnInit(): void {
//     this.cargarDatosDelDashboard();
//   }

//   cargarDatosDelDashboard(): void {
//     forkJoin({
//       usuarios: this.usuarioService.getAll(),
//       invitaciones: this.productoService.getAll(),
//       colecciones: this.coleccionService.all(),
//       pedidos: this.pedidoService.getAllPedidos()
//     }).subscribe(({ usuarios, invitaciones, colecciones, pedidos }) => {
//       this.totalUsuarios = usuarios.length;
//       this.invitacionesEnviadas = invitaciones.length;
//       this.coleccionesActivas = colecciones.length;
//       this.procesarEstadisticasDePedidos(pedidos);
//       this.generarMensajes(usuarios);
//     });
//   }

//   private procesarEstadisticasDePedidos(pedidos: Pedido[]): void {
//     const hoy = new Date();
//     const inicioDeMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
//     inicioDeMes.setHours(0, 0, 0, 0);

//     const anioActual = hoy.getFullYear();
//     let contadorPedidosMes = 0;
//     const distribucion: { [estado: string]: number } = {};
//     const porMes: { [mes: number]: number } = {};

//     for (const pedido of pedidos) {
//       const fechaPedido = new Date(pedido.fecha);

//       if (fechaPedido >= inicioDeMes && fechaPedido <= hoy) {
//         contadorPedidosMes++;
//       }
//       distribucion[pedido.estado] = (distribucion[pedido.estado] || 0) + 1;
//       if (fechaPedido.getFullYear() === anioActual) {
//         const mes = fechaPedido.getMonth() + 1;
//         porMes[mes] = (porMes[mes] || 0) + 1;
//       }
//     }

//     this.pedidosEsteMes = contadorPedidosMes;
//     this.prepararDatosParaGraficos(distribucion, porMes, pedidos.length);
//   }

//   private prepararDatosParaGraficos(distribucion: { [k: string]: number }, porMes: { [k: number]: number }, totalPedidos: number) {
//     const coloresEstado: { [key: string]: string } = {
//         'PENDIENTE': '#e9c0a9', 'EN_CAMINO': '#707070', 'ENTREGADO': '#b0817e', 'CANCELADO': '#d9534f'
//     };
//     this.distributionData = Object.keys(distribucion).map(estado => ({
//       state: estado,
//       count: distribucion[estado],
//       percentage: ((distribucion[estado] / totalPedidos) * 100).toFixed(1),
//       color: coloresEstado[estado] || '#ccc'
//     }));

//     const maxPedidosEnUnMes = Math.max(...Object.values(porMes), 0);
//     const nombresMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
//     this.barChartData = Object.keys(porMes).map(mesKey => {
//         const mesNumero = parseInt(mesKey);
//         const count = porMes[mesNumero];
//         return {
//             month: nombresMeses[mesNumero - 1],
//             count: count,
//             height: maxPedidosEnUnMes > 0 ? (count / maxPedidosEnUnMes) * 100 : 0
//         };
//     });
//   }

//   private generarMensajes(usuarios: Usuario[]): void {
//     const confirmados = usuarios.filter(u => u.enabled).length;
//     this.mensajesUsuarios = [
//       this.generarMensajeUsuario(confirmados, 'confirmado su cuenta'),
//       this.generarMensajeUsuario(this.totalUsuarios - confirmados, 'no ha confirmado su cuenta')
//     ];
//   }

//   private generarMensajeUsuario(cantidad: number, accion: string): string {
//     if (cantidad === 0) return `No hay usuarios que hayan ${accion}.`;
//     if (cantidad === 1) return `Hay 1 usuario que ha ${accion}.`;
//     return `Hay ${cantidad} usuarios que han ${accion}.`;
//   }
// }


import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, JsonPipe, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

import { UsuarioService } from '../../../services/usuario.service';
import { PedidoService } from '../../../services/pedido.service';
import { ColeccionService } from '../../../services/coleccion.service';
import { ProductoService } from '@app/services/invitacion.service'; // Asegúrate que el path es correcto
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
  // --- NUEVA PROPIEDAD para el estilo del gráfico de dona ---
  donutChartStyle: string = '';

  // --- Actividad Reciente ---
  actividadReciente = [
    { fecha: new Date().toISOString(), descripcion: 'Nuevo pedido #1234 realizado por Ana Pérez.' },
    { fecha: new Date(Date.now() - 3600000).toISOString(), descripcion: 'Juan García ha actualizado su perfil.' },
  ];

  ngOnInit(): void {
    this.cargarDatosDelDashboard();
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
    inicioDeMes.setHours(0, 0, 0, 0);
    const anioActual = hoy.getFullYear();

    let contadorPedidosMes = 0;
    const distribucion: { [estado: string]: number } = {};
    const porMes: { [mes: number]: number } = {};

    for (const pedido of pedidos) {
      const fechaPedido = new Date(pedido.fecha); // Asumimos que el formato ya es estándar
      if (fechaPedido >= inicioDeMes && fechaPedido <= hoy) {
        contadorPedidosMes++;
      }
      distribucion[pedido.estado] = (distribucion[pedido.estado] || 0) + 1;
      if (fechaPedido.getFullYear() === anioActual) {
        const mes = fechaPedido.getMonth() + 1;
        porMes[mes] = (porMes[mes] || 0) + 1;
      }
    }
    this.pedidosEsteMes = contadorPedidosMes;
    this.prepararDatosParaGraficos(distribucion, porMes, pedidos.length);
  }

  private prepararDatosParaGraficos(distribucion: { [k: string]: number }, porMes: { [k: number]: number }, totalPedidos: number) {
    const coloresEstado: { [key: string]: string } = {
        'PENDIENTE': '#e9c0a9', 'EN_CAMINO': '#707070', 'ENTREGADO': '#b0817e', 'CANCELADO': '#d9534f'
    };

    // 1. Preparamos los datos para la leyenda (esto ya estaba)
    this.distributionData = Object.keys(distribucion).map(estado => ({
      state: estado,
      count: distribucion[estado],
      percentage: totalPedidos > 0 ? ((distribucion[estado] / totalPedidos) * 100).toFixed(1) : '0.0',
      color: coloresEstado[estado] || '#ccc'
    }));

    // --- 2. NUEVA LÓGICA: Construimos el estilo CSS para el gráfico ---
    if (this.distributionData.length > 0) {
        let cumulativePercentage = 0;
        const gradientParts = this.distributionData.map(item => {
            const start = cumulativePercentage;
            const end = cumulativePercentage + parseFloat(item.percentage);
            cumulativePercentage = end;
            return `${item.color} ${start}% ${end}%`;
        });
        this.donutChartStyle = `background: conic-gradient(${gradientParts.join(', ')});`;
    } else {
        this.donutChartStyle = 'background: #f0f0f0;'; // Color base si no hay datos
    }

    // Preparar datos para gráfico de barras (sin cambios)
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
