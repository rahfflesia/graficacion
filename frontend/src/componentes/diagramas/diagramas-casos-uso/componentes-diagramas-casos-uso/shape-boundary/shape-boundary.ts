import { Component, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgDiagramNodeResizeAdornmentComponent,
  NgDiagramNodeSelectedDirective,
  NgDiagramNodeTemplate,
  NgDiagramPortComponent,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'shape-boundary',
  hostDirectives: [
    {
      directive: NgDiagramNodeSelectedDirective,
      inputs: ['node'],
    },
  ],
  imports: [NgDiagramPortComponent, NgDiagramNodeResizeAdornmentComponent, FormsModule],
  templateUrl: './shape-boundary.html',
  styleUrl: './shape-boundary.css',
})
export class ShapeBoundary implements NgDiagramNodeTemplate, OnInit {
  node: any = input.required<Node>();
  estaModoEdicionBoundaryActivado = false;

  ngOnInit(): void {
    console.log(this.node().data);
  }

  activarModoEdicionBoundary() {
    this.estaModoEdicionBoundaryActivado = true;
  }

  desactivarModoEdicionBoundary() {
    this.estaModoEdicionBoundaryActivado = false;
    console.log(this.node().data.nombreBoundary);
  }
}
