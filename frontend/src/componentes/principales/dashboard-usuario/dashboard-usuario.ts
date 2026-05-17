import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatosUsuario, Proyectos } from '../../../models/proceso.interface';
import { Api } from '../../../servicios/api';
import { Usuario } from '../../../servicios/usuario';
import { TemaService } from '../../../servicios/tema';

@Component({
  selector: 'dashboard-usuario',
  imports: [DatePipe],
  templateUrl: './dashboard-usuario.html',
  styleUrl: './dashboard-usuario.css',
})
export class DashboardUsuario implements OnInit {
  private api = inject(Api);
  private servicioUsuario = inject(Usuario);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private temaService = inject(TemaService);

  usuario = signal<DatosUsuario | null>(null);
  proyectos = signal<Proyectos[]>([]);
  estaCargando = signal(true);
  temaActual = this.temaService.tema;

  totalProyectos = computed(() => this.proyectos().length);
  proyectosActivos = computed(() => this.contarPorEstado('Activo'));
  proyectosPausados = computed(() => this.contarPorEstado('Pausado'));
  proyectosRevision = computed(() => this.contarPorEstado('En_revisi_n'));
  proyectosCancelados = computed(() => this.contarPorEstado('Cancelado'));
  proyectosRecientes = computed(() => this.proyectos().slice(0, 4));

  ngOnInit(): void {
    this.usuario.set(this.servicioUsuario.obtenerUsuario());
    const idUsuario = this.usuario()?.usuario.idusuario;

    if (idUsuario) {
      this.obtenerProyectos(idUsuario);
      return;
    }

    this.api.obtenerSesionActual().subscribe({
      next: (datosUsuario) => {
        this.servicioUsuario.guardarUsuario(datosUsuario);
        this.usuario.set(datosUsuario);
        this.obtenerProyectos(datosUsuario.usuario.idusuario);
      },
      error: (error) => {
        console.error(error);
        this.servicioUsuario.borrarUsuario();
        this.estaCargando.set(false);
        this.router.navigate(['/login']);
      },
    });
  }

  irAProyectos() {
    this.router.navigate(['/proyectos']);
  }

  alternarTema() {
    this.temaService.alternarTema();
  }

  obtenerIconoTema() {
    return this.temaActual() === 'oscuro'
      ? 'https://img.icons8.com/?size=100&id=URphhfIjBd0M&format=png&color=ffffff'
      : 'https://img.icons8.com/?size=100&id=45474&format=png&color=111c2d';
  }

  private obtenerProyectos(idUsuario: number) {
    this.api.obtenerProyectos(idUsuario).subscribe({
      next: (proyectos) => {
        this.proyectos.set(
          proyectos
            .filter((proyecto) => proyecto.idproyecto)
            .sort((a, b) => this.obtenerFecha(b).getTime() - this.obtenerFecha(a).getTime()),
        );
        this.estaCargando.set(false);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al obtener el dashboard', '', {
          toastClass: 'toastr-error',
        });
        this.estaCargando.set(false);
      },
    });
  }

  private contarPorEstado(estado: Proyectos['estado']) {
    return this.proyectos().filter((proyecto) => proyecto.estado === estado).length;
  }

  obtenerFecha(proyecto: Proyectos) {
    return new Date(proyecto.fechacreacion ?? proyecto.fechaCreacion ?? 0);
  }

  obtenerEstadoLegible(estado: Proyectos['estado']) {
    if (estado === 'En_revisi_n') return 'En revisión';
    return estado;
  }
}
