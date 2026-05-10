import { Component, input } from '@angular/core';
import {
  NgDiagramNodeResizeAdornmentComponent,
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-activacion',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [NgDiagramNodeResizeAdornmentComponent, NgDiagramPortComponent],
  templateUrl: './shape-activacion.html',
  styleUrl: './shape-activacion.css',
})
export class ShapeActivacion implements NgDiagramNodeTemplate {
  node: any = input.required<Node>();
}
