import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <h1>Finalizar compra</h1>
      <div class="layout">
        <div class="form-card">
          <h2>Dirección de envío</h2>
          <form [formGroup]="form" (ngSubmit)="confirmar()">
            <label>Dirección completa</label>
            <textarea formControlName="direccion" rows="3" placeholder="Calle, número, ciudad, código postal..."></textarea>
            @if (form.get('direccion')?.invalid && form.get('direccion')?.touched) {
              <span class="err">La dirección es obligatoria</span>
            }
            <button type="submit" class="btn">Confirmar pedido</button>
          </form>
        </div>
        <div class="resumen-card">
          <h2>Tu pedido</h2>
          @for (item of carrito.items(); track item.libro.id) {
            <div class="row">
              <span>{{ item.libro.titulo }} × {{ item.cantidad }}</span>
              <span>{{ (item.libro.precio * item.cantidad) | currency:'EUR' }}</span>
            </div>
          }
          <div class="row total">
            <strong>Total</strong>
            <strong>{{ carrito.totalPrecio() | currency:'EUR' }}</strong>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { font-size:1.8rem; font-weight:700; color:#1a1a2e; margin-bottom:1.5rem; }
    .layout { display:grid; grid-template-columns:1fr 320px; gap:2rem; }
    .form-card, .resumen-card { background:#fff; padding:1.5rem; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.08); }
    h2 { font-size:1.1rem; font-weight:700; margin-bottom:1rem; }
    label { display:block; font-size:.85rem; color:#555; margin-bottom:.3rem; }
    textarea { width:100%; padding:.6rem; border:2px solid #ddd; border-radius:8px; font-size:.95rem; resize:vertical; font-family:inherit; box-sizing:border-box; }
    textarea:focus { outline:none; border-color:#e8b86d; }
    .err { font-size:.8rem; color:#e53935; }
    .btn { display:block; width:100%; margin-top:1rem; padding:.8rem; background:#1a1a2e; color:#fff; border:none; border-radius:8px; font-size:1rem; font-weight:600; cursor:pointer; }
    .btn:hover { background:#e8b86d; color:#1a1a2e; }
    .row { display:flex; justify-content:space-between; padding:.4rem 0; border-bottom:1px solid #f0f0f0; font-size:.9rem; }
    .row.total { border:none; font-size:1rem; padding-top:.6rem; }
    @media (max-width:700px) { .layout { grid-template-columns:1fr; } }
  `]
})
export class CheckoutComponent {
  private fb      = inject(FormBuilder);
  private router  = inject(Router);
  carrito         = inject(CarritoService);
  private pedidos = inject(PedidosService);

  form = this.fb.group({ direccion: ['', Validators.required] });

  confirmar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const items = this.carrito.items().map(i => ({
      libroId: i.libro.id,
      titulo: i.libro.titulo,
      cantidad: i.cantidad,
      precioUnitario: i.libro.precio
    }));
    this.pedidos.guardar(this.form.value.direccion!, items, this.carrito.totalPrecio());
    this.carrito.vaciar();
    this.router.navigate(['/mis-pedidos']);
  }
}
