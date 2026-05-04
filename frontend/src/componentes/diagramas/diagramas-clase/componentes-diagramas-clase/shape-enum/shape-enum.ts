import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-enum',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [NgDiagramPortComponent, FormsModule],
  templateUrl: './shape-enum.html',
  styleUrl: './shape-enum.css',
})
export class ShapeEnum implements NgDiagramNodeTemplate {
  node: any = input.required<Node>();
  indiceValorEditando: number | null = null;
  estaModoEdicionNombreActivado = false;

  activarModoEdicionValor(index: number) {
    this.indiceValorEditando = index;
  }

  desactivarModoEdicionValor() {
    this.indiceValorEditando = null;
  }

  activarModoEdicionNombre() {
    this.estaModoEdicionNombreActivado = true;
  }

  desactivarModoEdicionNombre() {
    this.estaModoEdicionNombreActivado = false;
  }

  agregarValor() {
    const nombreMetodo = 'valor' + (this.node().data.metodos.length + 1).toString();
    this.node().data.valores.push(nombreMetodo);
  }

  borrarValor(index: number) {
    this.node().data.valores.splice(index, 1);
  }
}
