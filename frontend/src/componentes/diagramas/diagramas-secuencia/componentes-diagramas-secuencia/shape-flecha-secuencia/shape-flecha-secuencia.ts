import { Component, input } from '@angular/core';
import {
  NgDiagramNodeResizeAdornmentComponent,
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-flecha-secuencia',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [NgDiagramNodeResizeAdornmentComponent],
  templateUrl: './shape-flecha-secuencia.html',
  styleUrl: './shape-flecha-secuencia.css',
})
export class ShapeFlechaSecuencia implements NgDiagramNodeTemplate {
  node: any = input.required<Node>();

  esVertical() {
    const datos = this.node().data;
    return datos.orientacion === 'vertical' || Math.abs(Number(datos.angulo)) % 180 === 90;
  }

  alternarOrientacion() {
    const nodo = this.node();
    const seraVertical = !this.esVertical();
    nodo.data.orientacion = seraVertical ? 'vertical' : 'horizontal';
    nodo.data.angulo = seraVertical ? 90 : 0;

    const anchoActual = Number(nodo.size?.width) || 260;
    const altoActual = Number(nodo.size?.height) || 40;

    if (seraVertical) {
      nodo.size = {
        width: 32,
        height: Math.max(anchoActual, 120),
      };
    } else {
      nodo.size = {
        width: Math.max(altoActual, 120),
        height: 32,
      };
    }
  }
}
