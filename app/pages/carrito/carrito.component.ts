import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <h1>Tu carrito</h1>

      @if (carrito.items().length === 0) {
        <div class="empty">
          <p>Tu carrito está vacío.</p>
          <a routerLink="/" class="btn">Ver catálogo</a>
        </div>
      } @else {
        <div class="layout">
          <div class="items">
            @for (item of carrito.items(); track item.libro.id) {
              <div class="item">
                <img [src]="item.libro.imagenUrl || 'https://placehold.co/60x90?text=📚'" [alt]="item.libro.titulo" class="item-img" />
                <div class="item-info">
                  <strong>{{ item.libro.titulo }}</strong>
                  <p>{{ item.libro.autor }}</p>
                  <p>{{ item.libro.precio | currency:'EUR' }} / ud.</p>
                </div>
                <div class="item-qty">
                  <button (click)="carrito.setCantidad(item.libro.id, item.cantidad - 1)">−</button>
                  <span>{{ item.cantidad }}</span>
                  <button (click)="carrito.setCantidad(item.libro.id, item.cantidad + 1)">+</button>
                </div>
                <span class="item-sub">{{ (item.libro.precio * item.cantidad) | currency:'EUR' }}</span>
                <button class="btn-rm" (click)="carrito.quitar(item.libro.id)">✕</button>
              </div>
            }
          </div>
          <div class="resumen">
            <h2>Resumen</h2>
            <div class="row"><span>Artículos ({{ carrito.totalItems() }})</span><span>{{ carrito.totalPrecio() | currency:'EUR' }}</span></div>
            <div class="row total"><strong>Total</strong><strong>{{ carrito.totalPrecio() | currency:'EUR' }}</strong></div>
            <a routerLink="/checkout" class="btn">Finalizar compra</a>
            <button class="btn-vaciar" (click)="carrito.vaciar()">Vaciar carrito</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    h1 { font-size:1.8rem; font-weight:700; color:#1a1a2e; margin-bottom:1.5rem; }
    .empty { text-align:center; padding:3rem; }
    .layout { display:grid; grid-template-columns:1fr 290px; gap:2rem; align-items:start; }
    .item { display:flex; gap:1rem; align-items:center; background:#fff; padding:1rem; border-radius:10px; margin-bottom:.75rem; box-shadow:0 1px 4px rgba(0,0,0,.06); }
    .item-img { width:50px; height:75px; object-fit:cover; border-radius:6px; }
    .item-info { flex:1; font-size:.9rem; }
    .item-info p { color:#666; margin:.1rem 0 0; font-size:.82rem; }
    .item-qty { display:flex; align-items:center; gap:.4rem; }
    .item-qty button { width:26px; height:26px; border:1px solid #ddd; background:#f5f5f5; border-radius:4px; cursor:pointer; }
    .item-sub { font-weight:700; min-width:65px; text-align:right; }
    .btn-rm { background:none; border:none; color:#ccc; cursor:pointer; font-size:1rem; }
    .btn-rm:hover { color:#e53935; }
    .resumen { background:#fff; border-radius:12px; padding:1.5rem; box-shadow:0 2px 8px rgba(0,0,0,.08); position:sticky; top:80px; }
    h2 { font-size:1.1rem; font-weight:700; margin-bottom:1rem; }
    .row { display:flex; justify-content:space-between; padding:.4rem 0; border-bottom:1px solid #f0f0f0; font-size:.9rem; }
    .row.total { border:none; font-size:1rem; padding-top:.6rem; }
    .btn { display:block; text-align:center; background:#1a1a2e; color:#fff; padding:.75rem; border-radius:8px; text-decoration:none; font-weight:600; margin-top:1rem; }
    .btn:hover { background:#e8b86d; color:#1a1a2e; }
    .btn-vaciar { display:block; width:100%; background:none; border:1px solid #ddd; color:#888; padding:.5rem; border-radius:8px; cursor:pointer; margin-top:.5rem; font-size:.85rem; }
    @media (max-width:700px) { .layout { grid-template-columns:1fr; } }
  `]
})
export class CarritoComponent {
  carrito = inject(CarritoService);
}
