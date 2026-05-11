import { Component, input } from '@angular/core';
import {
  NgDiagramBaseEdgeComponent,
  NgDiagramEdgeTemplate,
  type Edge,
} from 'ng-diagram';

@Component({
  selector: 'edge-dependencia',
  imports: [NgDiagramBaseEdgeComponent],
  templateUrl: './edge-dependencia.html',
  styleUrl: './edge-dependencia.css',
})
export class EdgeDependencia implements NgDiagramEdgeTemplate {
  edge = input.required<Edge>();
}
