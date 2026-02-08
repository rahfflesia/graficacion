import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'modal-crear-proyecto',
  imports: [],
  templateUrl: './modal-crear-proyecto.html',
  styleUrl: './modal-crear-proyecto.css',
})
export class ModalCrearProyecto {
  @Output() cerrar = new EventEmitter<void>();

  cerrarModalCrearProyecto() {
    this.cerrar.emit();
  }
}
