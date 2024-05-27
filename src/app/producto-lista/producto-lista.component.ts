import { Component, OnInit } from '@angular/core';
import { Producto } from '../Class/producto';
import { ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
  styleUrl: './producto-lista.component.css',
})
export class ProductoListaComponent implements OnInit {
  productos: Producto[];

  constructor(
    private productoService: ProductoService,
    private router: Router,
   
  ) {}

  ngOnInit() {
    this.obtenerProductos();
  }

  private obtenerProductos() {
    this.productoService.obtenerListaProductos().subscribe((data) => {
      this.productos = data;
      console.log(this.productos);
    });
  }

  editarProducto(id: number) {
    //Redirecion al componente editar
    this.router.navigate(['editar-producto', id])
  }
  eliminarProducto(id: number) {
    //
    this.productoService.eliminarProducto(id).subscribe({
      next: (data) => this.obtenerProductos(),

      error: (errores) => console.log(errores),
    });
  }
  
}
