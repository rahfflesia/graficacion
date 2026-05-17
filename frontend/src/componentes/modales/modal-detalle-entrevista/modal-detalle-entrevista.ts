import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Entrevista } from '../../../models/entrevista';

@Component({
  selector: 'modal-detalle-entrevista',
  imports: [DatePipe],
  templateUrl: './modal-detalle-entrevista.html',
  styleUrl: './modal-detalle-entrevista.css',
})
export class ModalDetalleEntrevista {
  @Input() entrevista: Entrevista | null = null;

  @Input() toggler = false;

  @Output() cerrar = new EventEmitter<void>();
}
