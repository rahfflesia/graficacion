import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal-configuracion-proyecto',
  imports: [],
  templateUrl: './modal-configuracion-proyecto.html',
  styleUrl: './modal-configuracion-proyecto.css',
})
export class ModalConfiguracionProyecto {
  @Input() toggler: boolean = false;
  @Output() cerrar = new EventEmitter<void>();

  cerrarModalConfigurarProyecto() {
    this.cerrar.emit();
  }
}
