export interface Libro {
  id: number;
  isbn: string;
  titulo: string;
  autor: string;
  editorial: string;
  formato: string;
  edicion: string;
  precio: number;
  imagenUrl: string;
  stock: number;
  sinopsis: string;
}

export interface LibroRequestDto {
  isbn: string;
  titulo: string;
  autor: string;
  editorial: string;
  formato: string;
  edicion: string;
  precio: number;
  imagenUrl: string;
  stock: number;
  sinopsis: string;
}

export interface Usuario {
  name: string;
  rol: 'Admin' | 'Cliente';
  password: string;
}

export interface LoginRequest {
  name: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  password: string;
}

export interface CarritoItem {
  libro: Libro;
  cantidad: number;
}

export interface PedidoItem {
  libroId: number;
  titulo: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Pedido {
  id: string;
  fecha: string;
  direccion: string;
  total: number;
  items: PedidoItem[];
}
