import { Injectable, signal } from '@angular/core';

type Tema = 'claro' | 'oscuro';

@Injectable({
  providedIn: 'root',
})
export class TemaService {
  private readonly claveTema = 'temaPreferido';
  tema = signal<Tema>('claro');

  constructor() {
    const temaGuardado = localStorage.getItem(this.claveTema) as Tema | null;
    this.aplicarTema(temaGuardado === 'oscuro' ? 'oscuro' : 'claro');
  }

  alternarTema() {
    this.aplicarTema(this.tema() === 'oscuro' ? 'claro' : 'oscuro');
  }

  private aplicarTema(tema: Tema) {
    this.tema.set(tema);
    document.body.classList.toggle('modo-oscuro', tema === 'oscuro');
    localStorage.setItem(this.claveTema, tema);
  }
}
