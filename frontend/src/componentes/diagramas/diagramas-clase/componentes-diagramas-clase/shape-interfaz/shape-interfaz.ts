import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-interfaz',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [NgDiagramPortComponent, FormsModule],
  templateUrl: './shape-interfaz.html',
  styleUrl: './shape-interfaz.css',
})
export class ShapeInterfaz implements NgDiagramNodeTemplate {
  node: any = input.required<Node>();
  indiceMetodoEditando: number | null = null;
  estaModoEdicionInterfazActivado = false;

  agregarMetodo() {
    const nombreMetodo = 'método' + (this.node().data.metodos.length + 1).toString() + '()';
    this.node().data.metodos.push(nombreMetodo);
  }

  borrarMetodo(index: number) {
    this.node().data.metodos.splice(index, 1);
  }

  desactivarModoEdicionMetodo() {
    this.indiceMetodoEditando = null;
  }

  activarModoEdicion(index: number) {
    this.indiceMetodoEditando = index;
  }

  activarModoEdicionInterfaz() {
    this.estaModoEdicionInterfazActivado = true;
  }

  desactivarModoEdicionInterfaz() {
    this.estaModoEdicionInterfazActivado = false;
  }
}
