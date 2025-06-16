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
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

// Importa tus servicios
import { UsuarioService } from '../../../services/usuario.service';
import { PedidoService } from '../../../services/pedido.service';
import { ColeccionService } from '../../../services/coleccion.service';

// Importa las interfaces para mayor seguridad de tipos
import { Usuario } from '@app/models/interfaces/entities/usuario.interface';
import { Pedido } from '@app/models/interfaces/entities/pedido.interface';
import { ProductoService } from '@app/services/invitacion.service';

@Component({
  selector: 'app-dashboard',
  // standalone: true, // Descomenta si tu componente es standalone
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashBoardComponent implements OnInit {
  // --- Inyección de Servicios ---
  usuarioService = inject(UsuarioService);
  pedidoService = inject(PedidoService);
  coleccionService = inject(ColeccionService);
  productoService = inject(ProductoService); // Para las "invitaciones"

  // --- Propiedades que se mostrarán en el HTML ---
  totalUsuarios = 0;
  pedidosEsteMes = 0;
  invitacionesEnviadas = 0;
  coleccionesActivas = 0;
  mensajesUsuarios: string[] = [];

  // --- Propiedades para los gráficos (puedes pasarlas a tus componentes de gráficos) ---
  distribucionPedidosData: { [estado: string]: number } = {};
  pedidosPorMesData: { [mes: number]: number } = {};

  // --- Actividad Reciente (Estática como se definió) ---
  actividadReciente: { fecha: string; descripcion: string }[] = [
    { fecha: new Date().toISOString(), descripcion: 'Nuevo pedido #1234 realizado por Ana Pérez.' },
    { fecha: new Date(Date.now() - 3600000).toISOString(), descripcion: 'Juan García ha actualizado su perfil.' },
  ];

  ngOnInit(): void {
    this.cargarDatosDelDashboard();
  }

  cargarDatosDelDashboard(): void {
    // Usamos forkJoin para obtener todos los datos en paralelo. Es más eficiente.
    forkJoin({
      usuarios: this.usuarioService.getAll(),
      invitaciones: this.productoService.getAll(), // Productos = Invitaciones
      colecciones: this.coleccionService.all(),
      // Usamos TU NUEVO MÉTODO, que es más limpio y directo.
      pedidos: this.pedidoService.getAllPedidos()
    }).subscribe(({ usuarios, invitaciones, colecciones, pedidos }) => {

      // Asignamos los conteos directos
      this.totalUsuarios = usuarios.length;
      this.invitacionesEnviadas = invitaciones.length;
      this.coleccionesActivas = colecciones.length;

      // Procesamos la lista de pedidos para calcular el resto de estadísticas
      this.procesarEstadisticasDePedidos(pedidos);

      // Generamos los mensajes de usuarios
      this.generarMensajes(usuarios);
    });
  }

  /**
   * Procesa la lista completa de pedidos para calcular las estadísticas
   * y los datos necesarios para los gráficos.
   */
  private procesarEstadisticasDePedidos(pedidos: Pedido[]): void {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    // Reiniciamos los contadores
    let contadorPedidosMes = 0;
    const distribucion: { [estado: string]: number } = {};
    const porMes: { [mes: number]: number } = {};

    for (const pedido of pedidos) {
      const fechaPedido = new Date(pedido.fecha);

      // 1. Contar los pedidos de este mes
      if (fechaPedido.getMonth() === mesActual && fechaPedido.getFullYear() === anioActual) {
        contadorPedidosMes++;
      }

      // 2. Agrupar por estado para el gráfico de distribución
      distribucion[pedido.estado] = (distribucion[pedido.estado] || 0) + 1;

      // 3. Agrupar por mes para el gráfico de barras (solo del año actual)
      if (fechaPedido.getFullYear() === anioActual) {
        const mes = fechaPedido.getMonth() + 1; // Enero = 1, Febrero = 2, etc.
        porMes[mes] = (porMes[mes] || 0) + 1;
      }
    }

    // Asignamos los valores calculados a las propiedades del componente
    this.pedidosEsteMes = contadorPedidosMes;
    this.distribucionPedidosData = distribucion;
    this.pedidosPorMesData = porMes;

    // Puedes verificar los datos en la consola
    console.log('Datos para gráfico de distribución:', this.distribucionPedidosData);
    console.log('Datos para gráfico de pedidos por mes:', this.pedidosPorMesData);
  }

  /**
   * Genera los mensajes sobre el estado de confirmación de los usuarios.
   */
  private generarMensajes(usuarios: Usuario[]): void {
    const totalConfirmados = usuarios.filter(u => u.enabled).length;
    const totalNoConfirmados = this.totalUsuarios - totalConfirmados;

    this.mensajesUsuarios = [
      this.generarMensajeUsuario(totalConfirmados, 'confirmado su cuenta'),
      this.generarMensajeUsuario(totalNoConfirmados, 'no ha confirmado su cuenta')
    ];
  }

  private generarMensajeUsuario(cantidad: number, accion: string): string {
    if (cantidad === 0) return `No hay usuarios que hayan ${accion}.`;
    if (cantidad === 1) return `Hay 1 usuario que ha ${accion}.`;
    return `Hay ${cantidad} usuarios que han ${accion}.`;
  }
}
