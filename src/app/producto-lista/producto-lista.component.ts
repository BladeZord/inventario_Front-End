import { Component, OnInit } from '@angular/core';
import { Producto } from '../Class/producto';
import { ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
  styleUrls: ['./producto-lista.component.css'],
})
export class ProductoListaComponent implements OnInit {
  productos: Producto[] = [];
  productosPaginados: Producto[] = []; // Productos para la página actual

  editMode: boolean = false;
  editReg: Producto = new Producto();
  cPage: number = 1;
  cPageSize: number = 10;
  totalPages: number = 1; // Total de páginas

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerProductos();
  }

  private obtenerProductos() {
    this.productoService.obtenerListaProductos().subscribe((data) => {
      this.productos = data;
      this.productosPaginados = this.productos.slice();
      this.totalPages = Math.ceil(this.productos.length / this.cPageSize);
      this.actualizarPaginado();
    });
  }

  editarProducto(producto: Producto) {
    this.editMode = true;
    this.editReg = { ...producto };
  }

  eliminarProducto(id: number) {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Registro eliminado exitosamente',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.obtenerProductos(); // Actualiza la lista de productos después de eliminar
          },
          error: (error: any) => {
            console.error(error);
            Swal.fire({
              title: 'Ocurrió un error al eliminar',
              text: error,
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          },
        });
      }
    });
  }
  

  agregarProducto() {
    this.editMode = true;
    this.editReg = {
      idProducto: 0,
      descripcion: '',
      existencia: 0,
      precio: 0,
    }; 
    
    this.productos.unshift(this.editReg);
  }

  private resetForm() {
    this.editReg = {
      idProducto: 0,
      descripcion: '',
      existencia: 0,
      precio: 0,
    };
  }

  guardarProducto(producto: Producto) {
    const nuevoProducto: Producto = producto;

    if (nuevoProducto.descripcion.trim().length === 0) {
      Swal.fire({
        title: 'El campo descripción no puede estar vacío',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return;
    }
    if (nuevoProducto.existencia === 0) {
      Swal.fire({
        title: 'El campo existencia no puede estar en cero',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return;
    }
    if (nuevoProducto.precio === 0) {
      Swal.fire({
        title: 'El campo precio no puede estar en cero',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro que deseas guardar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        if (nuevoProducto.idProducto === 0) {
          // Agregar nuevo producto
          this.productoService.agregarProducto(nuevoProducto).subscribe({
            next: () => {
              Swal.fire({
                title: 'Registro guardado exitosamente',
                icon: 'success',
                confirmButtonText: 'Ok',
              });
              this.editMode = false;
              this.resetForm();
              this.obtenerProductos();
            },
            error: (error: any) => {
              console.error(error);
              Swal.fire({
                title: 'Ocurrió un error al guardar',
                text: error,
                icon: 'error',
                confirmButtonText: 'Ok',
              });
            },
          });
        } else {
          // Editar producto existente
          this.productoService
            .editarProducto(nuevoProducto.idProducto, nuevoProducto)
            .subscribe({
              next: () => {
                Swal.fire({
                  title: 'Registro editado exitosamente',
                  icon: 'success',
                  confirmButtonText: 'Ok',
                });
                this.editMode = false;
                this.resetForm();
                this.obtenerProductos();
              },
              error: (error: any) => {
                console.error(error);
                Swal.fire({
                  title: 'Ocurrió un error al guardar',
                  text: error,
                  icon: 'error',
                  confirmButtonText: 'Ok',
                });
              },
            });
        }
      }
    });
  }

  cancelar() {
    this.editMode = false;
    this.resetForm();
  }

  // Actualiza la lista de productos mostrados en la página actual
  actualizarPaginado() {
    const start = (this.cPage - 1) * this.cPageSize;
    const end = start + this.cPageSize;
    this.productosPaginados = this.productos.slice(start, end);
  }

  // Cambiar a la página anterior
  paginaAnterior() {
    if (this.cPage > 1) {
      this.cPage--;
      this.actualizarPaginado();
    }
  }

  // Cambiar a la página siguiente
  paginaSiguiente() {
    if (this.cPage < this.totalPages) {
      this.cPage++;
      this.actualizarPaginado();
    }
  }

  // Cambiar a una página específica
  cambiarPagina(pagina: number) {
    if (pagina > 0 && pagina <= this.totalPages) {
      this.cPage = pagina;
      this.actualizarPaginado();
    }
  }
}
