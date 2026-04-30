import { Component, input } from '@angular/core';
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
  imports: [NgDiagramPortComponent],
  templateUrl: './shape-enum.html',
  styleUrl: './shape-enum.css',
})
export class ShapeEnum implements NgDiagramNodeTemplate {
  node = input.required<Node>();
}
