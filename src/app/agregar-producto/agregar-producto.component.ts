import { Component } from '@angular/core';
import { Producto } from '../Class/producto';
import { ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css'
})
export class AgregarProductoComponent {
  producto: Producto  = new Producto();

  constructor(
    private productoService: ProductoService,
    private router: Router
  ){}

  onSubmit(){
    this.agregarProducto();
  }

  agregarProducto(){
    this.productoService.agregarProducto(this.producto).subscribe({
      next: (data) =>{
        this.irListaProductos();
      },
      error: (error: any) =>{
        console.log(error);
      }
    });
  }
  irListaProductos(){
    this.router.navigate(['/productos']);
  }

}
