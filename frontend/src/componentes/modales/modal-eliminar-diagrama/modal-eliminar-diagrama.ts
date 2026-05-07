import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal-eliminar-diagrama',
  imports: [],
  templateUrl: './modal-eliminar-diagrama.html',
  styleUrl: './modal-eliminar-diagrama.css',
})
export class ModalEliminarDiagrama {
  @Input() toggler = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
}
