import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgDiagramNodeResizeAdornmentComponent,
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-fragmento',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [FormsModule, NgDiagramNodeResizeAdornmentComponent, NgDiagramPortComponent],
  templateUrl: './shape-fragmento.html',
  styleUrl: './shape-fragmento.css',
})
export class ShapeFragmento implements NgDiagramNodeTemplate {
  node: any = input.required<Node>();
  estaEditandoOperador = false;
  estaEditandoCondicion = false;

  activarEdicionOperador() {
    this.estaEditandoOperador = true;
  }

  desactivarEdicionOperador() {
    if (!this.node().data.operador?.trim()) {
      this.node().data.operador = 'alt';
    }

    this.estaEditandoOperador = false;
  }

  activarEdicionCondicion() {
    this.estaEditandoCondicion = true;
  }

  desactivarEdicionCondicion() {
    this.estaEditandoCondicion = false;
  }
}
