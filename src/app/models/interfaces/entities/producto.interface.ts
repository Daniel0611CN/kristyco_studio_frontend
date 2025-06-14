import { Categoria } from "./categoria.interface";
import { Proveedor } from "./proveedor.interface";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: Categoria;
  proveedor: Proveedor;
}
