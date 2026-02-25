import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'modal-configuracion-proyecto',
  imports: [],
  templateUrl: './modal-configuracion-proyecto.html',
  styleUrl: './modal-configuracion-proyecto.css',
})
export class ModalConfiguracionProyecto {
  @Input() toggler: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  procesos = [];
  subprocesos = [];
  opcionSeleccionada = signal<'Procesos' | 'Subprocesos' | 'Roles'>('Procesos');

  cerrarModalConfigurarProyecto() {
    this.cerrar.emit();
  }

  seleccionarProcesos() {
    this.opcionSeleccionada.set('Procesos');
  }

  seleccionarSubprocesos() {
    this.opcionSeleccionada.set('Subprocesos');
  }

  seleccionarRoles() {
    this.opcionSeleccionada.set('Roles');
  }
}
