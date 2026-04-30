import { Component, input } from '@angular/core';
import {
  NgDiagramNodeSelectedDirective,
  type NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-clase',
  imports: [NgDiagramPortComponent],
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
  node = input.required<Node>();
}
