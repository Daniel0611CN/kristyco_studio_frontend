import { Enlaces } from "../../../models/interfaces/enlace.interface";

export const NAV_ITEMS: Enlaces[] = [
  { label: 'Inicio', link: '/home' },
  { label: 'Colecciones', link: '/colecciones' },
  { label: 'Sobre Mi', link: '/sobre-mi' },
  { label: 'Contacto', link: '/contacto' }
];

export const DROPDOWN_ITEMS: Enlaces[] = [
  { label: 'Registrarse', link: '/register' },
  { label: 'Iniciar Sesión', link: '/login' }
];

export const DROPDOWN_CONFIG_ITEMS: Enlaces[] = [
  { label: 'Administración', link: '/admin' },
  { label: 'Configuración', link: '/perfil' },
  { label: 'Cerrar Sesión', link: '/login' }
];

export const ADMIN_ITEMS: Enlaces[] = [
  { label: 'Administrador', link: '/admin' },
  { label: 'Listado de Colecciones', link: '/listado/colecciones' },
  { label: 'Listado de Invitaciones', link: '/listado/invitaciones' },
  { label: 'Listado de Pedidos', link: '/listado/pedidos' }
];
