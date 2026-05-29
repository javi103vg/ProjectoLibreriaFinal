import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LibrosService } from '../../services/libros.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { Libro } from '../../models/models';

@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detalle">
      @if (cargando()) {
        <div class="estado">Cargando...</div>
      } @else if (!libro()) {
        <div class="estado">Libro no encontrado.</div>
      } @else {
        <a routerLink="/" class="back">← Volver al catálogo</a>
        <div class="layout">
          <img [src]="libro()!.imagenUrl || 'https://placehold.co/300x450?text=Sin+imagen'" [alt]="libro()!.titulo" class="img" (error)="onImgError($event)" />
          <div class="info">
            <h1>{{ libro()!.titulo }}</h1>
            <p class="autor">{{ libro()!.autor }}</p>
            <div class="meta">
              @if (libro()!.editorial) { <span>{{ libro()!.editorial }}</span> }
              @if (libro()!.formato)   { <span>{{ libro()!.formato }}</span> }
              @if (libro()!.edicion)   { <span>{{ libro()!.edicion }}</span> }
              @if (libro()!.isbn)      { <span>ISBN: {{ libro()!.isbn }}</span> }
            </div>
            <p class="precio">{{ libro()!.precio | currency:'EUR' }}</p>
            <p class="stock" [class.agotado]="libro()!.stock === 0">
              {{ libro()!.stock > 0 ? 'En stock (' + libro()!.stock + ' disponibles)' : 'Agotado' }}
            </p>
            @if (libro()!.sinopsis) { <p class="sinopsis">{{ libro()!.sinopsis }}</p> }

            @if (auth.isLoggedIn() && !auth.isAdmin()) {
              <button class="btn-add" [disabled]="libro()!.stock === 0" (click)="agregar()">
                {{ agregado() ? '✓ Añadido al carrito' : '+ Añadir al carrito' }}
              </button>
            } @else if (!auth.isLoggedIn()) {
              <a routerLink="/auth/login" class="btn-add">Inicia sesión para comprar</a>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .estado { text-align:center; padding:3rem; color:#888; }
    .back { display:inline-block; margin-bottom:1.5rem; color:#888; text-decoration:none; font-size:.9rem; }
    .back:hover { color:#1a1a2e; }
    .layout { display:grid; grid-template-columns:300px 1fr; gap:2.5rem; align-items:start; }
    .img { width:100%; border-radius:12px; box-shadow:0 4px 16px rgba(0,0,0,.15); }
    h1 { font-size:1.8rem; font-weight:700; color:#1a1a2e; margin-bottom:.5rem; }
    .autor { font-size:1.1rem; color:#555; margin-bottom:1rem; }
    .meta { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:1rem; }
    .meta span { background:#f0ebe0; color:#666; padding:.2rem .6rem; border-radius:6px; font-size:.8rem; }
    .precio { font-size:2rem; font-weight:700; color:#1a1a2e; margin:.5rem 0; }
    .stock { color:#4caf50; font-weight:600; margin-bottom:1rem; }
    .stock.agotado { color:#e53935; }
    .sinopsis { color:#555; line-height:1.7; margin-bottom:1.5rem; }
    .btn-add { display:inline-block; padding:.8rem 2rem; background:#1a1a2e; color:#fff; border:none; border-radius:8px; font-size:1rem; font-weight:600; cursor:pointer; text-decoration:none; transition:background .2s; }
    .btn-add:hover:not(:disabled) { background:#e8b86d; color:#1a1a2e; }
    .btn-add:disabled { opacity:.5; cursor:not-allowed; }
    @media (max-width:640px) { .layout { grid-template-columns:1fr; } }
  `]
})
export class LibroDetalleComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private libros = inject(LibrosService);
  auth    = inject(AuthService);
  carrito = inject(CarritoService);

  libro    = signal<Libro | null>(null);
  cargando = signal(true);
  agregado = signal(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.libros.getById(id).subscribe({
      next: data => { this.libro.set(data); this.cargando.set(false); },
      error: ()  => this.cargando.set(false)
    });
  }

  agregar() {
    this.carrito.agregar(this.libro()!);
    this.agregado.set(true);
    setTimeout(() => this.agregado.set(false), 2000);
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'https://placehold.co/300x450?text=Sin+imagen';
  }
}
