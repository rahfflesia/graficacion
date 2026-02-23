import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-crear-proceso',
  imports: [FormsModule],
  templateUrl: './modal-crear-proceso.html',
  styleUrl: './modal-crear-proceso.css',
})
export class ModalCrearProceso {
  @Output() cerrar = new EventEmitter<void>();
  
  @Output() guardarProceso = new EventEmitter<any>();

  @Input() procesoAEditar: any = null; 

  nuevoProceso = { nombre: '', descripcion: '', creador: '' };

  ngOnInit() {
    if (this.procesoAEditar) {
      this.nuevoProceso = {
        nombre: this.procesoAEditar.nombre,
        descripcion: this.procesoAEditar.descripcion,
        creador: this.procesoAEditar.creador
      };
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  guardar() {
    this.guardarProceso.emit(this.nuevoProceso);    
    this.cerrarModal();
  }
}
