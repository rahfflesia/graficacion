import { Component } from '@angular/core';
import { ModalCrearProyecto } from '../../modales/modal-crear-proyecto/modal-crear-proyecto';
import { ModalConfiguracionProyecto } from '../../modales/modal-configuracion-proyecto/modal-configuracion-proyecto';
import { ProyectoCard } from '../../cards/proyecto-card/proyecto-card';

@Component({
  selector: 'seccion-proyectos',
  imports: [ModalCrearProyecto, ModalConfiguracionProyecto, ProyectoCard],
  templateUrl: './seccion-proyectos.html',
  styleUrl: './seccion-proyectos.css',
})
export class SeccionProyectos {
  proyectos: any = [];
  esCrearProyectoModalVisible: boolean = false;
  esConfigurarProyectoModalVisible: boolean = false;

  mostrarModalCrearProyecto() {
    this.esCrearProyectoModalVisible = true;
  }

  mostrarModalConfigurarProyecto() {
    this.esConfigurarProyectoModalVisible = true;
  }

  cerrarModalCrearProyecto(nuevoProyecto: any) {
    this.esCrearProyectoModalVisible = false;
    this.proyectos = [this.proyectos, ...nuevoProyecto];
  }

  cerrarModalConfigurarProyecto() {
    this.esConfigurarProyectoModalVisible = false;
  }
}
