import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../Class/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private urlBase = 'http://localhost:8080/inventario-app/v1/es/productos';

  constructor(private http: HttpClient) {}

  public obtenerListaProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlBase}`);
  }

  public agregarProducto(producto: Producto): Observable<Object> {
    return this.http.post(this.urlBase, producto);
  }

  public obtenerProductoPorId(id: number) {
    return this.http.get<Producto>(`${this.urlBase}/${id}`);
  }

  public editarProducto(id: number, producto: Producto): Observable<Object>{
    return this.http.put(`${this.urlBase}/${id}`, producto);
  }

  public eliminarProducto(id: number): Observable<Object> {
    return this.http.delete(`${this.urlBase}/ ${id}`)
  }
}
