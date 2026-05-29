import { Injectable, signal, computed } from '@angular/core';
import { CarritoItem, Libro } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly KEY = 'libreria_carrito';
  private _items = signal<CarritoItem[]>(this.load());

  readonly items       = this._items.asReadonly();
  readonly totalItems  = computed(() => this._items().reduce((s, i) => s + i.cantidad, 0));
  readonly totalPrecio = computed(() => this._items().reduce((s, i) => s + i.libro.precio * i.cantidad, 0));

  agregar(libro: Libro, cantidad = 1): void {
    const lista = this._items();
    const idx = lista.findIndex(i => i.libro.id === libro.id);
    if (idx >= 0) {
      const copia = [...lista];
      copia[idx] = { ...copia[idx], cantidad: copia[idx].cantidad + cantidad };
      this._items.set(copia);
    } else {
      this._items.set([...lista, { libro, cantidad }]);
    }
    this.save();
  }

  quitar(libroId: number): void {
    this._items.set(this._items().filter(i => i.libro.id !== libroId));
    this.save();
  }

  setCantidad(libroId: number, cantidad: number): void {
    if (cantidad <= 0) { this.quitar(libroId); return; }
    this._items.set(this._items().map(i => i.libro.id === libroId ? { ...i, cantidad } : i));
    this.save();
  }

  vaciar(): void {
    this._items.set([]);
    localStorage.removeItem(this.KEY);
  }

  private save(): void {
    localStorage.setItem(this.KEY, JSON.stringify(this._items()));
  }

  private load(): CarritoItem[] {
    const raw = localStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : [];
  }
}
