import { Enlaces } from '../../../models/interfaces/enlace.interface';

export const NAV_ITEMS: Enlaces[] = [
  { label: 'Inicio', link: '/home' },
  { label: 'Bodas', link: '/colecciones' },
  { label: 'Sobre Mi', link: '/sobre-mi' },
  { label: 'Contacto', link: '/contacto' }
];

export const DROPDOWN_CONFIG_ITEMS: Enlaces[] = [
  { label: 'Administración', link: '/admin' },
  { label: 'Perfil', link: '/perfil' },
  { label: 'Mis Pedidos', link: '/login' },
  { label: 'Realizar Pedido', link: '/realizar-pedido' },
  { label: 'Cerrar Sesión', link: '/login' }
];

export const ADMIN_ITEMS: Enlaces[] = [
  { label: 'Administrador', link: '/admin' },
  { label: 'Listado de Colecciones', link: '/listado/colecciones' },
  { label: 'Listado de Invitaciones', link: '/listado/invitaciones' },
  { label: 'Listado de Pedidos', link: '/listado/pedidos' }
];
