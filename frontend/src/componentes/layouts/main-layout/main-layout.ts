import { Component, inject, OnInit, signal } from '@angular/core';
import { Navbar } from '../../principales/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { TemaService } from '../../../servicios/tema';
import { Usuario } from '../../../servicios/usuario';
import { DatosUsuario } from '../../../models/proceso.interface';

@Component({
  selector: 'main-layout',
  imports: [Navbar, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  private temaService = inject(TemaService);
  private ServicioUsuario = inject(Usuario);

  usuario = signal<DatosUsuario | null>(null);
  temaActual = this.temaService.tema;

  ngOnInit(): void {
    this.usuario.set(this.ServicioUsuario.obtenerUsuario());
  }

  alternarTema() {
    this.temaService.alternarTema();
  }
}
