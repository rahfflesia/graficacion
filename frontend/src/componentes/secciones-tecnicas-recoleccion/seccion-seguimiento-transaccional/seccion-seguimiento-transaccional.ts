import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Participante } from '../../../models/participantesProyecto.interface';
import { Subproceso } from '../../../models/subprocesos.interface';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import { SeguimientoTransaccional } from '../../../models/seguimientoTransaccional';
import { ModalCarga } from '../../modales/modal-carga/modal-carga';
import { SeguimientoTransaccionalCard } from '../../cards/seguimiento-transaccional-card/seguimiento-transaccional-card';
import { ModalEditarSeguimientoTransaccional } from '../../modales/modal-editar-seguimiento-transaccional/modal-editar-seguimiento-transaccional';
import { editar } from '../../../crud-helpers/crudHelpers';
import { ModalDetalleSeguimiento } from '../../modales/modal-detalle-seguimiento/modal-detalle-seguimiento';

@Component({
  selector: 'seccion-seguimiento-transaccional',
  imports: [
    ReactiveFormsModule,
    ModalCarga,
    SeguimientoTransaccionalCard,
    ModalEditarSeguimientoTransaccional,
    ModalDetalleSeguimiento,
  ],
  templateUrl: './seccion-seguimiento-transaccional.html',
  styleUrl: './seccion-seguimiento-transaccional.css',
})
export class SeccionSeguimientoTransaccional implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  datosTecnica = signal<{ subproceso: Subproceso; participantes: Participante[] } | null>(null);
  participantesFiltrados: {
    participante: Participante;
    indiceOriginal: number;
  }[] = [];
  listaInvolucrados: Participante[] = [];
  participantes = signal<Participante[]>([]);

  formularioSeguimiento = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    tipotransaccion: ['', Validators.required],
    estado: ['', Validators.required],
    idresponsable: ['', Validators.required],
    fechaejecucion: ['', [Validators.required, this.esFechaFutura()]],
    resultadoesperado: ['', Validators.required],
    resultadoobtenido: ['', Validators.required],
    campobusqueda: ['', [this.listaInvolucradosVacia(), this.responsableEnListaInvolucrados()]],
  });

  seguimientosTransaccionales = signal<SeguimientoTransaccional[]>([]);
  seguimientoSeleccionado: SeguimientoTransaccional | null = null;

  estanCargandoSeguimientos = true;
  esModalEditarSeguimientoTransaccionalVisible = false;

  esModalDetalleSeguimientoVisible = false;

  constructor() {
    const datosNavegacion = this.router.currentNavigation();

    if (!datosNavegacion?.extras.state) return;

    const datosTecnica = datosNavegacion?.extras.state['datosTecnica'];

    this.datosTecnica.set(datosTecnica);
    this.participantes.set(this.datosTecnica()?.participantes!);

    console.log(datosTecnica);
  }

  ngOnInit(): void {
    const idSubproceso = this.datosTecnica()?.subproceso.idsubproceso;

    if (!idSubproceso) {
      console.error('El id del subproceso no se encuentra definida');
      return;
    }

    this.api.obtenerSeguimientosTransaccionales(idSubproceso).subscribe({
      next: (seguimientos) => {
        console.log(seguimientos);
        this.seguimientosTransaccionales.set(seguimientos);
        this.estanCargandoSeguimientos = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('', 'Ha ocurrido un error al obtener los seguimientos transaccionales', {
          toastClass: 'toastr-error',
        });
        this.estanCargandoSeguimientos = false;
      },
    });
  }

  get controlCampoBusqueda() {
    return this.formularioSeguimiento.get('campobusqueda');
  }

  mostrarModalEditarSeguimientoTransaccional(seguimiento: SeguimientoTransaccional) {
    this.seguimientoSeleccionado = seguimiento;
    this.esModalEditarSeguimientoTransaccionalVisible = true;
  }

  ocultarModalEditarSeguimientoTransaccional() {
    this.esModalEditarSeguimientoTransaccionalVisible = false;
  }

  filtrarParticipantes() {
    if (!this.participantes()) {
      console.error('La lista de participantes no se encuentra definida');
      return;
    }

    const valorCampoBusqueda = this.formularioSeguimiento.value.campobusqueda ?? '';

    this.participantesFiltrados = this.participantes()
      .map((participante, index) => ({ participante, indiceOriginal: index }))
      .filter(({ participante }) => {
        const nombreCompleto = `${participante.nombre} ${participante.apellidouno} ${participante.apellidodos ?? ''}`;
        return nombreCompleto.toLowerCase().includes(valorCampoBusqueda.toLowerCase());
      });
  }

  agregarInvolucrado(participante: Participante) {
    const yaExiste = this.listaInvolucrados.some((p) => p.idpersona === participante.idpersona);

    if (yaExiste) return;

    this.listaInvolucrados.push(participante);
  }

  eliminarInvolucrado(indice: number) {
    this.listaInvolucrados.splice(indice, 1);
    this.actualizarValidezBusqueda();
  }

  estaInvolucrado(idPersona: number) {
    return this.listaInvolucrados.some((participante) => participante.idpersona === idPersona);
  }

  toggleInvolucrado(participante: Participante) {
    const indiceParticipante = this.listaInvolucrados.findIndex(
      (p) => p.idpersona === participante.idpersona,
    );

    if (indiceParticipante >= 0) {
      this.listaInvolucrados.splice(indiceParticipante, 1);
    } else {
      this.listaInvolucrados.push(participante);
    }

    this.actualizarValidezBusqueda();
  }

  crearSeguimientoTransaccional() {
    const datosSeguimientoTransaccional: SeguimientoTransaccional = {
      nombre: this.formularioSeguimiento.value.nombre!,
      descripcion: this.formularioSeguimiento.value.descripcion!,
      idsubproceso: this.datosTecnica()?.subproceso.idsubproceso!,
      tipotransaccion: this.formularioSeguimiento.value.tipotransaccion as
        | 'Manual'
        | 'Autom_tica'
        | 'Sistema_externo',
      estado: this.formularioSeguimiento.value.estado as
        | 'Pendiente'
        | 'En_proceso'
        | 'Finalizado'
        | 'Error',
      idresponsable: parseInt(this.formularioSeguimiento.value.idresponsable!),
      fechaejecucion: new Date(this.formularioSeguimiento.value.fechaejecucion!).toISOString(),
      resultadoesperado: this.formularioSeguimiento.value.resultadoesperado!,
      resultadoobtenido: this.formularioSeguimiento.value.resultadoobtenido!,
      involucradosseguimiento: this.listaInvolucrados,
    };

    this.api.crearSeguimientoTransaccional(datosSeguimientoTransaccional).subscribe({
      next: (seguimiento) => {
        this.seguimientosTransaccionales.update((seguimientos) => [seguimiento, ...seguimientos]);
        this.toastr.success('Seguimiento transaccional creado correctamente');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('', 'Ha ocurrido un error al crear el seguimiento transaccional', {
          toastClass: 'toastr-error',
        });
      },
    });

    this.formularioSeguimiento.reset();
    this.listaInvolucrados = [];
  }

  obtenerControl(nombre: string) {
    return this.formularioSeguimiento.get(nombre);
  }

  actualizarValidezBusqueda() {
    this.obtenerControl('campobusqueda')?.updateValueAndValidity();
  }

  actualizarListaSeguimientosTransaccionales(idSeguimientoEliminado: number) {
    this.seguimientosTransaccionales.update((seguimientos) =>
      seguimientos.filter((seguimiento) => seguimiento.idseguimiento !== idSeguimientoEliminado),
    );
  }

  editarListaSeguimientosTransaccionales(seguimientoTransaccional: SeguimientoTransaccional) {
    editar(this.seguimientosTransaccionales, seguimientoTransaccional, 'idseguimiento');
  }

  mostrarModalDetalleSeguimiento(seguimiento: SeguimientoTransaccional) {
    this.seguimientoSeleccionado = seguimiento;
    this.esModalDetalleSeguimientoVisible = true;
  }

  ocultarModalDetalleSeguimiento() {
    this.esModalDetalleSeguimientoVisible = false;
    this.seguimientoSeleccionado = null;
  }

  esFechaFutura(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const fecha = new Date(control.value);
      const ahora = new Date();

      return fecha > ahora ? { fechaFutura: true } : null;
    };
  }

  listaInvolucradosVacia(): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.listaInvolucrados.length < 1 ? { listaInvolucradosVacia: true } : null;
    };
  }

  responsableEnListaInvolucrados(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.formularioSeguimiento) return null;
      const idResponsable = parseInt(this.formularioSeguimiento.value.idresponsable!);

      const existe = this.listaInvolucrados.some(
        (participante) => participante.idpersona === idResponsable,
      );

      return existe ? { responsableEnListaInvolucrados: true } : null;
    };
  }
}
