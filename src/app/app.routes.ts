import { LinvitacionComponent } from './components/content/admin/listado/linvitacion/linvitacion.component';
import { LcoleccionComponent } from './components/content/admin/listado/lcoleccion/lcoleccion.component';
import { LpedidoComponent } from './components/content/admin/listado/lpedido/lpedido.component';
import { InvitacionComponent } from './components/content/invitacion/invitacion.component';
import { ColeccionComponent } from './components/content/coleccion/coleccion.component';
import { ContactoComponent } from './components/content/contacto/contacto.component';
import { SobreMiComponent } from './components/content/sobre-mi/sobre-mi.component';
import { RegisterComponent } from './components/form/register/register.component';
import { PerfilComponent } from './components/content/perfil/perfil.component';
import { AdminComponent } from './components/content/admin/admin.component';
import { HomeComponent } from './components/content/home/home.component';
import { LoginComponent } from './components/form/login/login.component';
import { canActivateAdmin, canActivateUser, cannotActivateLoggedUser } from './security/authguard';
import { Routes } from '@angular/router';
import { SuccessComponent } from './components/shared/paypal/success/success.component';
import { CancelComponent } from './components/shared/paypal/cancel/cancel.component';
import { PaypalComponent } from './components/shared/paypal/paypal.component';
import { ConfirmTokenComponent } from './components/tokens/confirm-token/confirm-token.component';
import { PrivacyPolicyComponent } from './components/content/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/content/terms-and-conditions/terms-and-conditions.component';
import { ResetPasswordComponent } from './components/tokens/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'Inicio' },
  { path: 'colecciones', component: ColeccionComponent, title: 'Colecciones' },
  { path: 'sobre-mi', component: SobreMiComponent, title: 'Sobre-Mi' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto' },
  { path: 'login', component: LoginComponent, title: 'Inicio de Sesión', canActivate: [cannotActivateLoggedUser] },
  { path: 'register', component: RegisterComponent, title: 'Registro', canActivate: [cannotActivateLoggedUser] },
  { path: 'perfil', component: PerfilComponent, title: 'Perfil', canActivate: [canActivateUser] },
  { path: 'invitaciones', component: InvitacionComponent, title: 'Invitaciones' },
  { path: 'admin', component: AdminComponent, title: 'Admin', canActivate: [canActivateAdmin] },
  {
    path: 'listado',
    canActivate: [canActivateAdmin],
    children: [
      { path: 'colecciones', component: LcoleccionComponent, title: 'Listado Colecciones' },
      { path: 'invitaciones', component: LinvitacionComponent, title: 'Listado Invitaciones' },
      { path: 'pedidos', component: LpedidoComponent, title: 'Listado Pedidos' },
    ]
  },
  { path: 'paypal', component: PaypalComponent, title: 'Paypal', canActivate: [canActivateUser] },
  { path: 'payment/success', component: SuccessComponent, title: 'Pago Exitoso', canActivate: [canActivateUser] },
  { path: 'payment/cancel', component: CancelComponent, title: 'Pago Cancelado', canActivate: [canActivateUser] },
  { path: 'confirmar-token/:token', component: ConfirmTokenComponent, title: 'Confirmar Token' },
  { path: 'reset-password/:token', component: ResetPasswordComponent, title: 'Restablecer Contraseña' },
  { path: 'politica-privacidad', component: PrivacyPolicyComponent, title: 'Política de Privacidad' },
  { path: 'terminos-condiciones', component: TermsAndConditionsComponent, title: 'Términos y Condiciones' },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];
