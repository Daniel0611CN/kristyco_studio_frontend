export interface Usuario {
  id: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: string;
  direccion: string;
  enabled: boolean;
}

export class Usuario {
  id: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
  telefono: string;
  direccion: string;

  constructor(id = '', nombre = '', apellido1 = '', apellido2 = '', email = '', telefono = '', direccion = '') {
    this.id = id;
    this.nombre = nombre;
    this.apellido1 = apellido1;
    this.apellido2 = apellido2;
    this.email = email;
    this.telefono = telefono;
    this.direccion = direccion;
  }
}
