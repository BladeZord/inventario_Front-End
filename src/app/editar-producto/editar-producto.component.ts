import { Component, OnInit } from '@angular/core';
import { Producto } from '../Class/producto';
import { ProductoService } from '../services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent implements OnInit {
  producto: Producto = new Producto();
  id: number;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private idProductoPorRuta: ActivatedRoute
  ){}
  
  ngOnInit(){
    this.id = this.idProductoPorRuta.snapshot.params['id'];
    this.productoService.obtenerProductoPorId(this.id).subscribe(
      {
        next: (data) => this.producto = data
        ,
        error: (errores: any) => console.log(errores)
      }
    );
  }
  
  onSubmit(){
    this.guardarProducto();
  }

  guardarProducto(){
    this.productoService.editarProducto(this.id, this.producto).subscribe(
      {
        next: (datos) => this.irProductoLista(),
        error: (errores) => console.log(errores)
      }
    );

  }
  irProductoLista(){
   this.router.navigate(['/productos'])   
  }

}
