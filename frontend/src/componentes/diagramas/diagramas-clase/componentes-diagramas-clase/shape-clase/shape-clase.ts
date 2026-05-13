import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgDiagramNodeSelectedDirective,
  type NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-clase',
  imports: [NgDiagramPortComponent, FormsModule],
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  templateUrl: './shape-clase.html',
  styleUrl: './shape-clase.css',
})
export class ShapeClase implements NgDiagramNodeTemplate {
  node: any = input.required<Node>();
  estaModoEdicionActivado = false;
  estaModoEdicionClaseActivado = false;
  indiceAtributoEditando: number | null = null;
  indiceMetodoEditando: number | null = null;

  activarModoEdicion(index: number, propiedad: 'atributo' | 'metodo') {
    switch (propiedad) {
      case 'atributo':
        this.indiceAtributoEditando = index;
        break;
      case 'metodo':
        this.indiceMetodoEditando = index;
        break;
    }
  }

  agregarAtributo() {
    const nombreAtributo = 'Atributo ' + (this.node().data.atributos.length + 1).toString();
    this.node().data.atributos.push(nombreAtributo);
  }

  agregarMetodo() {
    const nombreMetodo = 'método' + (this.node().data.metodos.length + 1).toString() + '()';
    this.node().data.metodos.push(nombreMetodo);
  }

  borrarAtributo(index: number) {
    this.node().data.atributos.splice(index, 1);
  }

  borrarMetodo(index: number) {
    this.node().data.metodos.splice(index, 1);
  }

  desactivarModoEdicionAtributo() {
    this.indiceAtributoEditando = null;
  }

  desactivarModoEdicionMetodo() {
    this.indiceMetodoEditando = null;
  }

  activarModoEdicionClase() {
    this.estaModoEdicionClaseActivado = true;
  }

  desactivarModoEdicionClase() {
    this.estaModoEdicionClaseActivado = false;
  }
}
