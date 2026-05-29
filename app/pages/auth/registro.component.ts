import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="card">
        <h1>Crear cuenta</h1>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <label>Nombre de usuario</label>
          <input type="text" formControlName="name" placeholder="usuario123" />
          <label>Contraseña</label>
          <input type="password" formControlName="password" placeholder="Mínimo 4 caracteres" />
          @if (error()) { <div class="err">{{ error() }}</div> }
          <button type="submit">Registrarse</button>
        </form>
        <p class="alt">¿Ya tienes cuenta? <a routerLink="/auth/login">Inicia sesión</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display:flex; justify-content:center; align-items:center; min-height:60vh; }
    .card { background:#fff; padding:2.5rem; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,.1); width:100%; max-width:400px; }
    h1 { font-size:1.6rem; font-weight:700; color:#1a1a2e; margin-bottom:1.5rem; text-align:center; }
    label { display:block; font-size:.85rem; color:#555; margin:.8rem 0 .3rem; }
    input { width:100%; padding:.6rem .8rem; border:2px solid #ddd; border-radius:8px; font-size:.95rem; box-sizing:border-box; }
    input:focus { outline:none; border-color:#e8b86d; }
    button { width:100%; margin-top:1.25rem; padding:.8rem; background:#1a1a2e; color:#fff; border:none; border-radius:8px; font-size:1rem; font-weight:600; cursor:pointer; }
    button:hover { background:#e8b86d; color:#1a1a2e; }
    .err { margin-top:.75rem; padding:.5rem; background:#ffebee; color:#c62828; border-radius:6px; font-size:.85rem; }
    .alt { text-align:center; margin-top:1rem; font-size:.9rem; color:#666; }
    .alt a { color:#1a1a2e; font-weight:600; }
  `]
})
export class RegistroComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  error = signal('');
  form  = this.fb.group({
    name:     ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  submit() {
    if (this.form.invalid) return;
    const result = this.auth.register(this.form.value as any);
    if (result.ok) this.router.navigate(['/']);
    else this.error.set(result.error!);
  }
}
