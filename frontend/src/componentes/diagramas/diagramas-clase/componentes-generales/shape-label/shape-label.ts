import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgDiagramNodeSelectedDirective, NgDiagramNodeTemplate, type Node } from 'ng-diagram';

@Component({
  selector: 'shape-label',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [FormsModule],
  templateUrl: './shape-label.html',
  styleUrl: './shape-label.css',
})
export class ShapeLabel implements NgDiagramNodeTemplate {
  node: any = input.required<Node>();
  estaModoEdicionActivado = false;
  textoEtiqueta = '';

  activarModoEdicion() {
    this.estaModoEdicionActivado = true;
  }

  desactivarModoEdicion() {
    this.estaModoEdicionActivado = false;
  }

  establecerValorEtiqueta() {
    this.node().data.etiqueta = this.textoEtiqueta;
    this.desactivarModoEdicion();
    console.log(this.node().data.etiqueta);
  }
}
