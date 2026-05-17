import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TemaService } from '../../../servicios/tema';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private temaService = inject(TemaService);
  temaActual = this.temaService.tema;

  alternarTema() {
    this.temaService.alternarTema();
  }

  obtenerIconoTema() {
    return this.temaActual() === 'oscuro'
      ? 'https://img.icons8.com/?size=100&id=URphhfIjBd0M&format=png&color=ffffff'
      : 'https://img.icons8.com/?size=100&id=45474&format=png&color=111c2d';
  }
}
