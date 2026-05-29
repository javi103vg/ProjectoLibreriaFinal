import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LibrosService } from '../../services/libros.service';
import { Libro, LibroRequestDto } from '../../models/models';

@Component({
  selector: 'app-admin-libros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin">
      <div class="admin-header">
        <h1>Gestión de libros</h1>
        <button class="btn-new" (click)="abrir()">+ Nuevo libro</button>
      </div>

      @if (error()) { <div class="api-error">{{ error() }}</div> }

      @if (mostrarForm()) {
        <div class="overlay" (click)="cerrar()">
          <div class="modal" (click)="$event.stopPropagation()">
            <h2>{{ editando() ? 'Editar libro' : 'Nuevo libro' }}</h2>
            <form [formGroup]="form" (ngSubmit)="guardar()">
              <div class="grid">
                <div class="field full"><label>Título *</label><input formControlName="titulo" /></div>
                <div class="field full"><label>Autor *</label><input formControlName="autor" /></div>
                <div class="field">
                  <label>ISBN (13 dígitos) *</label>
                  <input formControlName="isbn" placeholder="9788420412146" />
                  @if (form.get('isbn')?.errors?.['pattern'] && form.get('isbn')?.touched) {
                    <span class="ferr">Debe tener 13 dígitos</span>
                  }
                </div>
                <div class="field"><label>Editorial</label><input formControlName="editorial" /></div>
                <div class="field">
                  <label>Formato</label>
                  <select formControlName="formato">
                    <option value="">-- Seleccionar --</option>
                    <option>Tapa dura</option><option>Bolsillo</option><option>Digital</option>
                  </select>
                </div>
                <div class="field"><label>Edición</label><input formControlName="edicion" /></div>
                <div class="field"><label>Precio *</label><input type="number" step="0.01" min="0.01" formControlName="precio" /></div>
                <div class="field"><label>Stock *</label><input type="number" min="0" formControlName="stock" /></div>
                <div class="field full"><label>URL imagen</label><input formControlName="imagenUrl" placeholder="https://..." /></div>
                <div class="field full"><label>Sinopsis</label><textarea formControlName="sinopsis" rows="3"></textarea></div>
              </div>
              @if (errorForm()) { <div class="api-error">{{ errorForm() }}</div> }
              <div class="modal-actions">
                <button type="button" class="btn-cancel" (click)="cerrar()">Cancelar</button>
                <button type="submit" class="btn-save" [disabled]="guardando()">{{ guardando() ? 'Guardando...' : 'Guardar' }}</button>
              </div>
            </form>
          </div>
        </div>
      }

      <div class="tabla-wrap">
        @if (cargando()) {
          <p class="estado">Cargando...</p>
        } @else {
          <table>
            <thead><tr><th>ID</th><th>Título</th><th>Autor</th><th>ISBN</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              @for (libro of libros(); track libro.id) {
                <tr>
                  <td>{{ libro.id }}</td>
                  <td>{{ libro.titulo }}</td>
                  <td>{{ libro.autor }}</td>
                  <td>{{ libro.isbn }}</td>
                  <td>{{ libro.precio | currency:'EUR' }}</td>
                  <td>{{ libro.stock }}</td>
                  <td class="acciones">
                    <button class="btn-edit" (click)="editar(libro)">✏️</button>
                    <button class="btn-del"  (click)="eliminar(libro)">🗑️</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin h1 { font-size:1.8rem; font-weight:700; color:#1a1a2e; }
    .admin-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; }
    .btn-new { background:#1a1a2e; color:#fff; padding:.6rem 1.2rem; border:none; border-radius:8px; cursor:pointer; font-weight:600; }
    .btn-new:hover { background:#e8b86d; color:#1a1a2e; }
    .api-error { background:#ffebee; color:#c62828; padding:.6rem 1rem; border-radius:8px; margin-bottom:1rem; font-size:.9rem; }
    .estado { text-align:center; padding:2rem; color:#888; }
    .tabla-wrap { overflow-x:auto; background:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.08); }
    table { width:100%; border-collapse:collapse; }
    thead tr { background:#1a1a2e; }
    th { color:#fff; padding:.75rem 1rem; text-align:left; font-size:.85rem; }
    td { padding:.75rem 1rem; border-bottom:1px solid #f0f0f0; font-size:.88rem; }
    tr:last-child td { border-bottom:none; }
    tr:hover td { background:#fafafa; }
    .acciones { white-space:nowrap; }
    .btn-edit, .btn-del { border:none; background:none; cursor:pointer; font-size:1rem; padding:.2rem .3rem; }
    .overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:200; display:flex; align-items:center; justify-content:center; padding:1rem; }
    .modal { background:#fff; border-radius:16px; padding:2rem; width:100%; max-width:680px; max-height:90vh; overflow-y:auto; }
    .modal h2 { font-size:1.2rem; font-weight:700; margin-bottom:1.5rem; color:#1a1a2e; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:.9rem; }
    .field { display:flex; flex-direction:column; gap:.2rem; }
    .field.full { grid-column:1/-1; }
    label { font-size:.8rem; color:#555; }
    input, select, textarea { padding:.5rem .7rem; border:2px solid #ddd; border-radius:6px; font-size:.9rem; font-family:inherit; }
    input:focus, select:focus, textarea:focus { outline:none; border-color:#e8b86d; }
    .ferr { font-size:.75rem; color:#e53935; }
    .modal-actions { display:flex; gap:.75rem; justify-content:flex-end; margin-top:1.25rem; }
    .btn-cancel { padding:.6rem 1.2rem; border:2px solid #ddd; background:#fff; border-radius:8px; cursor:pointer; }
    .btn-save { padding:.6rem 1.4rem; background:#1a1a2e; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600; }
    .btn-save:hover:not(:disabled) { background:#e8b86d; color:#1a1a2e; }
    .btn-save:disabled { opacity:.6; cursor:not-allowed; }
  `]
})
export class AdminLibrosComponent implements OnInit {
  private svc = inject(LibrosService);
  private fb  = inject(FormBuilder);

  libros      = signal<Libro[]>([]);
  cargando    = signal(true);
  mostrarForm = signal(false);
  editando    = signal<Libro | null>(null);
  guardando   = signal(false);
  error       = signal('');
  errorForm   = signal('');

  form = this.fb.group({
    isbn:      ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    titulo:    ['', Validators.required],
    autor:     ['', Validators.required],
    editorial: [''],
    formato:   [''],
    edicion:   [''],
    precio:    [0.01, [Validators.required, Validators.min(0.01)]],
    stock:     [0,    [Validators.required, Validators.min(0)]],
    imagenUrl: [''],
    sinopsis:  ['']
  });

  ngOnInit() { this.cargar(); }

  cargar() {
    this.cargando.set(true);
    this.svc.getAll().subscribe({
      next: data => { this.libros.set(data); this.cargando.set(false); },
      error: ()  => { this.error.set('No se pudo conectar con la API.'); this.cargando.set(false); }
    });
  }

  abrir() {
    this.editando.set(null);
    this.errorForm.set('');
    this.form.reset({ precio: 0.01, stock: 0 });
    this.mostrarForm.set(true);
  }

  editar(libro: Libro) {
    this.editando.set(libro);
    this.errorForm.set('');
    this.form.patchValue(libro as any);
    this.mostrarForm.set(true);
  }

  cerrar() { this.mostrarForm.set(false); this.editando.set(null); }

  guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando.set(true);
    this.errorForm.set('');
    const dto = this.form.value as LibroRequestDto;
    const libro = this.editando();
    const op$ = libro ? this.svc.actualizar(libro.id, dto) : this.svc.crear(dto);
    op$.subscribe({
      next: () => { this.cargar(); this.cerrar(); this.guardando.set(false); },
      error: err => { this.guardando.set(false); this.errorForm.set(err.error || 'Error al guardar.'); }
    });
  }

  eliminar(libro: Libro) {
    if (!confirm(`¿Eliminar "${libro.titulo}"?`)) return;
    this.svc.eliminar(libro.id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No se pudo eliminar.')
    });
  }
}
