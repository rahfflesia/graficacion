import { Component, inject, Injector, OnInit } from '@angular/core';
import {
  NgDiagramComponent,
  initializeModel,
  provideNgDiagram,
  NgDiagramMinimapComponent,
  NgDiagramNodeTemplateMap,
  NgDiagramModelService,
} from 'ng-diagram';
import { ShapeClase } from '../componentes-diagramas-clase/shape-clase/shape-clase';
import { ShapeInterfaz } from '../componentes-diagramas-clase/shape-interfaz/shape-interfaz';
import { ShapeEnum } from '../componentes-diagramas-clase/shape-enum/shape-enum';
import { ShapeLabel } from '../componentes-generales/shape-label/shape-label';

@Component({
  selector: 'canvas-diagrama-clase',
  imports: [NgDiagramComponent, NgDiagramMinimapComponent],
  templateUrl: './canvas-diagrama-clase.html',
  styleUrl: './canvas-diagrama-clase.css',
  providers: [provideNgDiagram()],
})
export class CanvasDiagramaClase implements OnInit {
  private modelService = inject(NgDiagramModelService);
  private injector = inject(Injector);

  estaAbiertoMenuLateral = false;

  nodos = this.modelService.nodes;
  enlaces = this.modelService.edges;
  metadatos = this.modelService.metadata;

  nodeTemplateMap = new NgDiagramNodeTemplateMap([
    ['diagramaClase', ShapeClase],
    ['diagramaInterfaz', ShapeInterfaz],
    ['diagramaEnum', ShapeEnum],
    ['etiqueta', ShapeLabel],
  ]);

  model = initializeModel({
    nodes: [],
    edges: [],
  });

  // Inicializo el lienzo
  ngOnInit(): void {
    if (this.cargarDiagramaClase()) {
      console.log('Se ha encontrado un diagrama guardado, se cargará el diagrama');
    }
  }

  abrirMenuLateral() {
    this.estaAbiertoMenuLateral = true;
  }

  cerrarMenuLateral() {
    this.estaAbiertoMenuLateral = false;
  }

  agregarForma(tipoForma: string) {
    const idShape = (this.nodos().length + 1).toString();
    this.modelService.addNodes([
      {
        id: idShape,
        position: { x: 500, y: 350 },
        type: tipoForma,
        data: {},
      },
    ]);
  }

  onDragStart(event: DragEvent, tipoForma: string) {
    event.dataTransfer?.setData('text/plain', tipoForma);
  }

  f(event: DragEvent) {
    event.preventDefault();
    const tipo = event.dataTransfer?.getData('text/plain');
    if (!tipo) {
      console.error('No se encontró el tipo de la forma');
      return;
    }
    this.agregarForma(tipo!);
  }

  guardarDiagramaClase() {
    const jsonString = this.model.toJSON();
    localStorage.setItem('diagrama', jsonString);
  }

  cargarDiagramaClase() {
    const diagrama = localStorage.getItem('diagrama');
    if (diagrama) {
      const diagramaParseado = JSON.parse(diagrama);
      this.model = initializeModel(diagramaParseado, this.injector);
      return true;
    }
    return false;
  }
}
