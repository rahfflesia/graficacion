import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal-crear-diagrama',
  imports: [],
  templateUrl: './modal-crear-diagrama.html',
  styleUrl: './modal-crear-diagrama.css',
})
export class ModalCrearDiagrama {
  @Input() toggler: boolean = false;

  @Output() cerrar = new EventEmitter<void>();
}
