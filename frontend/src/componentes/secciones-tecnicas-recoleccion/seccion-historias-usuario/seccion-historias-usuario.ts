import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Participante } from '../../../models/participantesProyecto.interface';
import { Subproceso } from '../../../models/subprocesos.interface';
import { DatosFormularioHistoriaUsuario, HistoriaUsuario } from '../../../models/historiaUsuario';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import { ModalCarga } from '../../modales/modal-carga/modal-carga';

@Component({
  selector: 'seccion-historias-usuario',
  imports: [ReactiveFormsModule, FormsModule, ModalCarga],
  templateUrl: './seccion-historias-usuario.html',
  styleUrl: './seccion-historias-usuario.css',
})
export class SeccionHistoriasUsuario implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  datosTecnica = signal<{ subproceso: Subproceso; participantes: Participante[] } | null>(null);
  subproceso: Subproceso | undefined = undefined;
  participantes = signal<Participante[]>([]);
  historias = signal<HistoriaUsuario[]>([]);
  estanCargandoHistorias = true;
  historiaEnEdicion: HistoriaUsuario | null = null;
  criterioActual = '';
  criterios: string[] = [];

  formulario = this.formBuilder.group({
    idcreador: ['', [Validators.required]],
    rolusuario: ['', [Validators.required]],
    necesidad: ['', [Validators.required]],
    beneficio: ['', [Validators.required]],
    prioridad: ['', [Validators.required]],
  });

  constructor() {
    const datosNavegacion = this.router.currentNavigation();
    if (!datosNavegacion?.extras.state) return;
    const datosTecnica = datosNavegacion.extras.state['datosTecnica'];
    this.datosTecnica.set(datosTecnica);
    this.participantes.set(datosTecnica?.participantes ?? []);
    this.subproceso = datosTecnica?.subproceso;
  }

  ngOnInit(): void {
    const idSubproceso = this.subproceso?.idsubproceso;
    if (!idSubproceso) return;
    this.api.obtenerHistoriasUsuario(idSubproceso).subscribe({
      next: (historias) => {
        this.estanCargandoHistorias = false;
        this.historias.set(historias);
      },
      error: () => {
        this.toastr.error('Error al cargar las historias de usuario', '', { toastClass: 'toastr-error' });
      },
    });
  }

  agregarCriterio() {
    const criterio = this.criterioActual.trim();
    if (!criterio) return;
    this.criterios.push(criterio);
    this.criterioActual = '';
  }

  eliminarCriterio(indice: number) {
    this.criterios.splice(indice, 1);
  }

  crearHistoria() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { idcreador, rolusuario, necesidad, beneficio, prioridad } = this.formulario.value;
    const datos: DatosFormularioHistoriaUsuario = {
      idsubproceso: this.subproceso!.idsubproceso,
      idcreador: Number(idcreador),
      rolusuario: rolusuario!,
      necesidad: necesidad!,
      beneficio: beneficio!,
      criteriosaceptacion: [...this.criterios],
      prioridad: prioridad!,
    };
    this.api.crearHistoriaUsuario(datos).subscribe({
      next: (historia) => {
        this.historias.update((lista) => [...lista, historia]);
        this.formulario.reset();
        this.criterios = [];
        this.toastr.success('Historia de usuario creada', '', { toastClass: 'toastr-success' });
      },
      error: () => {
        this.toastr.error('Error al crear la historia de usuario', '', { toastClass: 'toastr-error' });
      },
    });
  }

  iniciarEdicion(historia: HistoriaUsuario) {
    this.historiaEnEdicion = historia;
    this.criterios = [...historia.criteriosaceptacion];
    this.formulario.patchValue({
      idcreador: String(historia.idcreador),
      rolusuario: historia.rolusuario,
      necesidad: historia.necesidad,
      beneficio: historia.beneficio,
      prioridad: historia.prioridad,
    });
  }

  cancelarEdicion() {
    this.historiaEnEdicion = null;
    this.criterios = [];
    this.formulario.reset();
  }

  guardarEdicion() {
    if (this.formulario.invalid || !this.historiaEnEdicion) return;
    const { rolusuario, necesidad, beneficio, prioridad } = this.formulario.value;
    const datos = {
      rolusuario: rolusuario!,
      necesidad: necesidad!,
      beneficio: beneficio!,
      criteriosaceptacion: [...this.criterios],
      prioridad: prioridad!,
    };
    this.api.editarHistoriaUsuario(this.historiaEnEdicion.idhistoriausuario, datos).subscribe({
      next: (historiaActualizada) => {
        this.historias.update((lista) =>
          lista.map((h) =>
            h.idhistoriausuario === historiaActualizada.idhistoriausuario ? historiaActualizada : h
          )
        );
        this.cancelarEdicion();
        this.toastr.success('Historia actualizada', '', { toastClass: 'toastr-success' });
      },
      error: () => {
        this.toastr.error('Error al editar la historia', '', { toastClass: 'toastr-error' });
      },
    });
  }

  eliminarHistoria(historia: HistoriaUsuario) {
    this.api.eliminarHistoriaUsuario(historia.idhistoriausuario).subscribe({
      next: () => {
        this.historias.update((lista) =>
          lista.filter((h) => h.idhistoriausuario !== historia.idhistoriausuario)
        );
        this.toastr.success('Historia eliminada', '', { toastClass: 'toastr-success' });
      },
      error: () => {
        this.toastr.error('Error al eliminar la historia', '', { toastClass: 'toastr-error' });
      },
    });
  }
}
