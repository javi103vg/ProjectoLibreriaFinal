import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <h1>Mis pedidos</h1>

      @if (pedidos.pedidos().length === 0) {
        <div class="empty">
          <p>Aún no has realizado ningún pedido.</p>
          <a routerLink="/" class="btn">Ver catálogo</a>
        </div>
      }

      @for (pedido of pedidos.pedidos(); track pedido.id) {
        <div class="card">
          <div class="card-header">
            <span class="pid">Pedido #{{ pedido.id.slice(0,8) }}</span>
            <span class="fecha">{{ pedido.fecha | date:'dd/MM/yyyy HH:mm' }}</span>
            <span class="total">{{ pedido.total | currency:'EUR' }}</span>
          </div>
          <p class="dir">📦 {{ pedido.direccion }}</p>
          <div class="items">
            @for (item of pedido.items; track item.libroId) {
              <div class="item-row">
                <span>{{ item.titulo }}</span>
                <span class="qty">× {{ item.cantidad }}</span>
                <span>{{ (item.precioUnitario * item.cantidad) | currency:'EUR' }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    h1 { font-size:1.8rem; font-weight:700; color:#1a1a2e; margin-bottom:1.5rem; }
    .empty { text-align:center; padding:3rem; }
    .btn { display:inline-block; background:#1a1a2e; color:#fff; padding:.6rem 1.2rem; border-radius:8px; text-decoration:none; }
    .card { background:#fff; border-radius:12px; padding:1.25rem; margin-bottom:1rem; box-shadow:0 2px 8px rgba(0,0,0,.07); }
    .card-header { display:flex; gap:1rem; align-items:center; flex-wrap:wrap; margin-bottom:.5rem; }
    .pid { font-weight:700; font-family:monospace; }
    .fecha { color:#888; font-size:.85rem; }
    .total { margin-left:auto; font-weight:700; font-size:1.05rem; }
    .dir { color:#666; font-size:.85rem; margin-bottom:.75rem; }
    .items { border-top:1px solid #f0f0f0; padding-top:.75rem; }
    .item-row { display:flex; gap:1rem; font-size:.9rem; padding:.2rem 0; }
    .item-row span:first-child { flex:1; }
    .qty { color:#888; }
  `]
})
export class MisPedidosComponent {
  pedidos = inject(PedidosService);
}
