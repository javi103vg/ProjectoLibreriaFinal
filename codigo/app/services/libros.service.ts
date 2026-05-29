import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro, LibroRequestDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class LibrosService {
  private readonly API = 'https://localhost:7175/api/libros';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.API);
  }

  getById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.API}/${id}`);
  }

  crear(dto: LibroRequestDto): Observable<void> {
    return this.http.post<void>(this.API, dto);
  }

  actualizar(id: number, dto: LibroRequestDto): Observable<void> {
    return this.http.put<void>(`${this.API}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
