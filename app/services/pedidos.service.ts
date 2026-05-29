import { Injectable, signal } from '@angular/core';
import { Pedido, PedidoItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly KEY = 'libreria_pedidos';
  private _pedidos = signal<Pedido[]>(this.load());

  readonly pedidos = this._pedidos.asReadonly();

  guardar(direccion: string, items: PedidoItem[], total: number): Pedido {
    const pedido: Pedido = {
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      direccion,
      total,
      items
    };
    const lista = [...this._pedidos(), pedido];
    this._pedidos.set(lista);
    localStorage.setItem(this.KEY, JSON.stringify(lista));
    return pedido;
  }

  private load(): Pedido[] {
    const raw = localStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : [];
  }
}
