import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="brand">📚 Librería</a>

      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Catálogo</a>
        @if (auth.isAdmin()) {
          <a routerLink="/admin" routerLinkActive="active">Gestión libros</a>
        }
      </div>

      <div class="nav-actions">
        @if (auth.isLoggedIn()) {
          <span class="user-name">{{ auth.usuario()?.name }}</span>
          <a routerLink="/mis-pedidos" class="btn-ghost">Mis pedidos</a>
          <a routerLink="/carrito" class="btn-carrito">
            🛒
            @if (carrito.totalItems() > 0) {
              <span class="badge">{{ carrito.totalItems() }}</span>
            }
          </a>
          <button (click)="auth.logout()" class="btn-outline">Salir</button>
        } @else {
          <a routerLink="/auth/login" class="btn-ghost">Entrar</a>
          <a routerLink="/auth/registro" class="btn-primary">Registrarse</a>
          <a routerLink="/auth/login" class="btn-carrito" title="Inicia sesión para usar el carrito">🛒</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar { display:flex; align-items:center; justify-content:space-between; padding:0 2rem; height:64px; background:#1a1a2e; color:#fff; position:sticky; top:0; z-index:100; box-shadow:0 2px 12px rgba(0,0,0,.3); }
    .brand { text-decoration:none; color:#fff; font-size:1.2rem; font-weight:700; }
    .nav-links { display:flex; gap:1.5rem; }
    .nav-links a { color:#ccc; text-decoration:none; font-size:.9rem; transition:color .2s; }
    .nav-links a:hover, .nav-links a.active { color:#e8b86d; }
    .nav-actions { display:flex; align-items:center; gap:.75rem; }
    .user-name { color:#e8b86d; font-size:.85rem; font-weight:600; }
    .btn-ghost { color:#ccc; text-decoration:none; font-size:.9rem; padding:.4rem .8rem; border-radius:6px; }
    .btn-ghost:hover { background:rgba(255,255,255,.1); }
    .btn-primary { background:#e8b86d; color:#1a1a2e; text-decoration:none; padding:.4rem 1rem; border-radius:6px; font-weight:600; font-size:.9rem; }
    .btn-outline { background:transparent; border:1px solid #555; color:#ccc; padding:.4rem .8rem; border-radius:6px; cursor:pointer; font-size:.9rem; }
    .btn-outline:hover { border-color:#e8b86d; color:#e8b86d; }
    .btn-carrito { position:relative; font-size:1.2rem; text-decoration:none; padding:.3rem .5rem; }
    .badge { position:absolute; top:-4px; right:-4px; background:#e8b86d; color:#1a1a2e; border-radius:50%; width:18px; height:18px; display:flex; align-items:center; justify-content:center; font-size:.65rem; font-weight:700; }
  `]
})
export class NavbarComponent {
  auth    = inject(AuthService);
  carrito = inject(CarritoService);
}
