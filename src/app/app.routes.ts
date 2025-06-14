import { InvitacionComponent } from './components/content/invitacion/invitacion.component';
import { ColeccionComponent } from './components/content/coleccion/coleccion.component';
import { ContactoComponent } from './components/content/contacto/contacto.component';
import { SobreMiComponent } from './components/content/sobre-mi/sobre-mi.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { PerfilComponent } from './components/content/perfil/perfil.component';
import { HomeComponent } from './components/content/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { canActivateAuth } from './core/guards/auth.guard';
import { Routes } from '@angular/router';
import { SuccessComponent } from './components/shared/components/paypal/success/success.component';
import { CancelComponent } from './components/shared/components/paypal/cancel/cancel.component';
import { PaypalComponent } from './components/shared/components/paypal/paypal.component';
import { ConfirmTokenComponent } from './components/tokens/confirm-token/confirm-token.component';
import { PrivacyPolicyComponent } from './components/content/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/content/terms-and-conditions/terms-and-conditions.component';
import { ResetPasswordComponent } from './components/tokens/reset-password/reset-password.component';
import { canActivateGuest } from './core/guards/guest.guard';
import { canActivateAdmin } from './core/guards/admin.guard';
import { ListadoInvitacionComponent } from './components/admin/listado/invitaciones/invitaciones.component';
import { ListadoColeccionComponent } from './components/admin/listado/colecciones/colecciones.component';
import { DashBoardComponent } from './components/admin/dashboard/dashboard.component';
import { ListadoPedidoComponent } from './components/admin/listado/pedidos/pedidos.component';
import { ColeccionesComponent } from './components/content/colecciones/colecciones.component';
import { AcabadosComponent } from './components/content/acabados/acabados.component';
import { DetallesComponent } from './components/content/detalles/detalles.component';
import { RegalosComponent } from './components/content/regalos/regalos.component';
import { RealizarPedidoComponent } from './components/content/realizar-pedido/realizar-pedido.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'Inicio' },
  {
    path: 'colecciones',
    children: [
      {
        path: '',
        component: ColeccionesComponent,
        title: 'Colecciones'
      },
      {
        path: ':nombre',
        children: [
          {
            path: '',
            component: ColeccionComponent,
            title: 'Detalle Colección'
          },
          {
            path: 'invitaciones',
            component: InvitacionComponent,
            title: 'Invitaciones por Colección'
          }
        ]
      }
    ]
  },
  { path: 'acabados', component: AcabadosComponent, title: 'Acabados' },
  { path: 'detalles', component: DetallesComponent, title: 'Detalles' },
  { path: 'regalos', component: RegalosComponent, title: 'Regalos' },
  { path: 'sobre-mi', component: SobreMiComponent, title: 'Sobre-Mi' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto' },
  { path: 'login', component: LoginComponent, title: 'Inicio de Sesión', canActivate: [canActivateGuest] },
  { path: 'register', component: RegisterComponent, title: 'Registro', canActivate: [canActivateGuest] },
  { path: 'perfil', component: PerfilComponent, title: 'Perfil', canActivate: [canActivateAuth] },
  { path: 'realizar-pedido', component: RealizarPedidoComponent, title: 'Realizar Pedido', canActivate: [canActivateAuth] },
  { path: 'admin', component: DashBoardComponent, title: 'Dashboard', canActivate: [canActivateAdmin] },
  {
    path: 'listado',
    canActivate: [canActivateAdmin],
    children: [
      { path: 'colecciones', component: ListadoColeccionComponent, title: 'Listado Colecciones' },
      { path: 'invitaciones', component: ListadoInvitacionComponent, title: 'Listado Invitaciones' },
      { path: 'pedidos', component: ListadoPedidoComponent, title: 'Listado Pedidos' },
    ]
  },
  { path: 'paypal/:id', component: PaypalComponent, title: 'Paypal', canActivate: [canActivateAuth] },
  { path: 'payment/success', component: SuccessComponent, title: 'Pago Exitoso', canActivate: [canActivateAuth] },
  { path: 'payment/cancel', component: CancelComponent, title: 'Pago Cancelado', canActivate: [canActivateAuth] },
  { path: 'confirmar-token/:token', component: ConfirmTokenComponent, title: 'Confirmar Token' },
  { path: 'reset-password/:token', component: ResetPasswordComponent, title: 'Restablecer Contraseña' },
  { path: 'politica-privacidad', component: PrivacyPolicyComponent, title: 'Política de Privacidad' },
  { path: 'terminos-condiciones', component: TermsAndConditionsComponent, title: 'Términos y Condiciones' },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];
