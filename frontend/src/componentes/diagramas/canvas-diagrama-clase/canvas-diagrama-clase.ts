import { Component, OnInit } from '@angular/core';
import { dia, shapes } from '@joint/core';

@Component({
  selector: 'canvas-diagrama-clase',
  imports: [],
  templateUrl: './canvas-diagrama-clase.html',
  styleUrl: './canvas-diagrama-clase.css',
})
export class CanvasDiagramaClase implements OnInit {
  private graph: any;

  ngOnInit(): void {
    this.graph = new dia.Graph();

    new dia.Paper({
      el: document.getElementById('canvas')!,
      model: this.graph,
      width: 800,
      height: 400,
      gridSize: 10,
      drawGrid: true,
    });

    const rect = new shapes.standard.Rectangle();

    rect.position(100, 100);
    rect.resize(120, 50);
    rect.attr({
      body: { fill: 'blue' },
      label: { text: 'Hola JointJS', fill: 'white' },
    });

    rect.addTo(this.graph);
  }

  agregarDiagramaClase() {
    const contenedor = new shapes.standard.Rectangle();
    const cabecera = new shapes.standard.Rectangle();
    const atributos = new shapes.standard.Rectangle();
    const metodos = new shapes.standard.Rectangle();

    contenedor.position(0, 0);
    contenedor.resize(300, 200);
    contenedor.attr({
      body: { fill: 'blue' },
      label: { text: 'Rectángulo creado con el botón' },
    });
    contenedor.addTo(this.graph);

    cabecera.position(0, 0);
    cabecera.resize(300, 50);
    cabecera.attr({
      body: { fill: 'blue', pointerEvents: 'none' },
      label: { text: 'Rectangulo' },
    });
    cabecera.addTo(this.graph);

    atributos.position(0, 50);
    atributos.resize(300, 75);
    atributos.attr({
      body: { fill: 'white', pointerEvents: 'none' },
      label: { text: 'Atributos: Área/n, Perímetro/n' },
    });
    atributos.addTo(this.graph);

    metodos.position(0, 125);
    metodos.resize(300, 75);
    metodos.attr({
      body: {
        fill: 'white',
        pointerEvents: 'none',
      },
      label: { text: 'Métodos' },
    });
    metodos.addTo(this.graph);

    contenedor.embed(cabecera);
    contenedor.embed(atributos);
    contenedor.embed(metodos);
  }
}
