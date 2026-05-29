import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, LoginRequest, RegisterRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'libreria_session';
  private readonly USERS_KEY   = 'libreria_users';

  private _usuario = signal<Usuario | null>(this.loadSession());

  readonly usuario    = this._usuario.asReadonly();
  readonly isLoggedIn = computed(() => !!this._usuario());
  readonly isAdmin    = computed(() => this._usuario()?.rol === 'Admin');

  constructor(private router: Router) {
    if (this.getUsers().length === 0) {
      this.saveUser({ name: 'admin', password: 'admin123', rol: 'Admin' });
    }
  }

  login(data: LoginRequest): { ok: boolean; error?: string } {
    const user = this.getUsers().find(u => u.name === data.name && u.password === data.password);
    if (!user) return { ok: false, error: 'Usuario o contraseña incorrectos' };
    this.saveSession(user);
    return { ok: true };
  }

  register(data: RegisterRequest): { ok: boolean; error?: string } {
    if (this.getUsers().find(u => u.name === data.name)) {
      return { ok: false, error: 'El nombre de usuario ya existe' };
    }
    const newUser: Usuario = { name: data.name, password: data.password, rol: 'Cliente' };
    this.saveUser(newUser);
    this.saveSession(newUser);
    return { ok: true };
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this._usuario.set(null);
    this.router.navigate(['/']);
  }

  private saveSession(user: Usuario): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    this._usuario.set(user);
  }

  private loadSession(): Usuario | null {
    const raw = localStorage.getItem(this.SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private getUsers(): Usuario[] {
    const raw = localStorage.getItem(this.USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveUser(user: Usuario): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }
}
