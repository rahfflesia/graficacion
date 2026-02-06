import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../componentes/principales/navbar/navbar';
import { SeccionProyectos } from '../componentes/principales/seccion-proyectos/seccion-proyectos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, SeccionProyectos],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
