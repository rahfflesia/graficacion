import { Component, Input } from '@angular/core';

@Component({
  selector: 'modal-carga',
  imports: [],
  templateUrl: './modal-carga.html',
  styleUrl: './modal-carga.css',
})
export class ModalCarga {
  @Input() toggler = false;
  @Input() mensaje = '';
}
