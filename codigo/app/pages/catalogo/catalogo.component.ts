import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LibrosService } from '../../services/libros.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { Libro } from '../../models/models';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="catalogo">
      <div class="catalogo-header">
        <h1>Catálogo</h1>
        <input type="text" placeholder="Buscar por título o autor..." [(ngModel)]="searchTerm" class="search-input" />
      </div>

      @if (cargando()) {
        <div class="estado">Cargando libros...</div>
      } @else if (error()) {
        <div class="estado error">{{ error() }}</div>
      } @else if (librosFiltrados().length === 0) {
        <div class="estado">No se encontraron libros.</div>
      } @else {
        <div class="grid">
          @for (libro of librosFiltrados(); track libro.id) {
            <div class="card">
              <a [routerLink]="['/libro', libro.id]" class="card-img-link">
                <img [src]="libro.imagenUrl || 'https://placehold.co/220x330?text=Sin+imagen'" [alt]="libro.titulo" class="card-img" (error)="onImgError($event)" />
              </a>
              <div class="card-body">
                <a [routerLink]="['/libro', libro.id]" class="card-titulo">{{ libro.titulo }}</a>
                <p class="card-autor">{{ libro.autor }}</p>
                <p class="card-editorial">{{ libro.editorial }}</p>
                <div class="card-footer">
                  <span class="precio">{{ libro.precio | currency:'EUR' }}</span>
                  <span class="stock" [class.agotado]="libro.stock === 0">{{ libro.stock > 0 ? 'En stock' : 'Agotado' }}</span>
                </div>
                @if (auth.isLoggedIn() && !auth.isAdmin()) {
                  <button class="btn-add" [disabled]="libro.stock === 0" (click)="agregar(libro)">
                    {{ agregado() === libro.id ? '✓ Añadido' : '+ Añadir al carrito' }}
                  </button>
                } @else if (!auth.isLoggedIn()) {
                  <a routerLink="/auth/login" class="btn-login-hint">Inicia sesión para comprar</a>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .catalogo-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
    h1 { font-size:2rem; font-weight:700; color:#1a1a2e; }
    .search-input { padding:.6rem 1rem; border:2px solid #ddd; border-radius:8px; font-size:1rem; width:300px; }
    .search-input:focus { outline:none; border-color:#e8b86d; }
    .estado { text-align:center; padding:3rem; color:#888; }
    .estado.error { color:#e53935; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:1.5rem; }
    .card { background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.08); transition:transform .2s,box-shadow .2s; }
    .card:hover { transform:translateY(-4px); box-shadow:0 6px 20px rgba(0,0,0,.12); }
    .card-img-link { display:block; aspect-ratio:2/3; overflow:hidden; background:#f0ebe0; }
    .card-img { width:100%; height:100%; object-fit:cover; transition:transform .3s; }
    .card:hover .card-img { transform:scale(1.04); }
    .card-body { padding:1rem; }
    .card-titulo { font-weight:700; color:#1a1a2e; text-decoration:none; font-size:.95rem; display:block; margin-bottom:.2rem; }
    .card-titulo:hover { color:#e8b86d; }
    .card-autor { color:#666; font-size:.85rem; margin:0 0 .2rem; }
    .card-editorial { color:#999; font-size:.8rem; margin:0 0 .5rem; }
    .card-footer { display:flex; justify-content:space-between; align-items:center; margin:.4rem 0; }
    .precio { font-size:1.1rem; font-weight:700; color:#1a1a2e; }
    .stock { font-size:.75rem; color:#4caf50; font-weight:600; }
    .stock.agotado { color:#e53935; }
    .btn-add { width:100%; padding:.5rem; background:#1a1a2e; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:.85rem; margin-top:.4rem; transition:background .2s; }
    .btn-add:hover:not(:disabled) { background:#e8b86d; color:#1a1a2e; }
    .btn-add:disabled { opacity:.5; cursor:not-allowed; }
    .btn-login-hint { display:block; text-align:center; margin-top:.5rem; font-size:.8rem; color:#888; text-decoration:none; padding:.4rem; }
    .btn-login-hint:hover { color:#e8b86d; }
  `]
})
export class CatalogoComponent implements OnInit {
  private librosService = inject(LibrosService);
  auth    = inject(AuthService);
  carrito = inject(CarritoService);

  libros   = signal<Libro[]>([]);
  cargando = signal(true);
  error    = signal('');
  agregado = signal<number | null>(null);
  searchTerm = '';

  librosFiltrados() {
    const t = this.searchTerm.toLowerCase();
    if (!t) return this.libros();
    return this.libros().filter(l => l.titulo.toLowerCase().includes(t) || l.autor.toLowerCase().includes(t));
  }

  ngOnInit() {
    this.librosService.getAll().subscribe({
      next: data => { this.libros.set(data); this.cargando.set(false); },
      error: ()  => { this.error.set('No se pudo conectar con la API. ¿Está en marcha?'); this.cargando.set(false); }
    });
  }

  agregar(libro: Libro) {
    this.carrito.agregar(libro);
    this.agregado.set(libro.id);
    setTimeout(() => this.agregado.set(null), 1500);
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'https://placehold.co/220x330?text=Sin+imagen';
  }
}
