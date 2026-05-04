import { Component, inject, OnInit, signal } from '@angular/core';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Entrevista } from '../../../models/entrevista';
import { crear, eliminar } from '../../../crud-helpers/crudHelpers';
import { Router } from '@angular/router';
import { Subproceso } from '../../../models/subprocesos.interface';
import { Participante } from '../../../models/participantesProyecto.interface';
import { EntrevistaCard } from '../../cards/entrevista-card/entrevista-card';
import { ModalAgregarParticipante } from '../../modales/modal-agregar-participante/modal-agregar-participante';
import { FormEntrevistas } from '../../forms/form-entrevistas/form-entrevistas';
import { ModalCarga } from '../../modales/modal-carga/modal-carga';
import { finalize, timeout } from 'rxjs';

interface DatosTecnicaEntrevista {
  subproceso: Subproceso;
  participantes: Participante[];
  idproyecto: number;
}

@Component({
  selector: 'seccion-entrevistas',
  imports: [
    ReactiveFormsModule,
    EntrevistaCard,
    ModalAgregarParticipante,
    FormEntrevistas,
    ModalCarga,
  ],
  templateUrl: './seccion-entrevistas.html',
  styleUrl: './seccion-entrevistas.css',
})
export class SeccionEntrevistas implements OnInit {
  private api = inject(Api);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  entrevistas = signal<Entrevista[]>([]);
  subproceso = signal<Subproceso | null>(null);
  idproyecto = signal<number>(0);
  participantes = signal<Participante[]>([]);

  esModalAgregarParticipanteVisible = false;
  estaCargando = false;
  private readonly claveDatosTecnica = 'datosTecnicaActual';

  constructor() {
    const datosNavegacion = this.router.currentNavigation();
    const datosTecnica = this.obtenerDatosTecnica(datosNavegacion?.extras.state?.['datosTecnica']);

    if (!datosTecnica) return;

    this.subproceso.set(datosTecnica.subproceso);
    this.participantes.set(datosTecnica.participantes);
    this.idproyecto.set(datosTecnica.idproyecto);
  }

  ngOnInit(): void {
    const idSubproceso = this.subproceso()?.idsubproceso;

    if (!idSubproceso) {
      console.error('El id del subproceso no se encuentra definido');
      this.toastr.error('Selecciona un subproceso antes de abrir entrevistas');
      this.router.navigate(['/proyectos']);
      return;
    }

    this.estaCargando = true;

    this.api
      .obtenerEntrevistas(idSubproceso)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.estaCargando = false;
        }),
      )
      .subscribe({
        next: (entrevistas) => {
          if (!Array.isArray(entrevistas)) {
            console.error('La respuesta de entrevistas no es una lista', entrevistas);
            this.entrevistas.set([]);
            this.toastr.error('No se pudieron cargar las entrevistas');
            return;
          }

          this.entrevistas.set(entrevistas);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Ha ocurrido un error al obtener las entrevistas');
        },
      });
  }

  obtenerDatosTecnica(datosState?: DatosTecnicaEntrevista): DatosTecnicaEntrevista | null {
    if (this.esDatosTecnicaValido(datosState)) {
      localStorage.setItem(this.claveDatosTecnica, JSON.stringify(datosState));
      return datosState;
    }

    const datosGuardados = localStorage.getItem(this.claveDatosTecnica);
    if (!datosGuardados) return null;

    try {
      const datosTecnica = JSON.parse(datosGuardados) as DatosTecnicaEntrevista;
      return this.esDatosTecnicaValido(datosTecnica) ? datosTecnica : null;
    } catch {
      localStorage.removeItem(this.claveDatosTecnica);
      return null;
    }
  }

  esDatosTecnicaValido(datosTecnica?: DatosTecnicaEntrevista): datosTecnica is DatosTecnicaEntrevista {
    return !!datosTecnica?.subproceso?.idsubproceso && Array.isArray(datosTecnica.participantes);
  }

  mostrarModalAgregarParticipante() {
    this.esModalAgregarParticipanteVisible = true;
  }

  ocultarModalAgregarParticipante() {
    this.esModalAgregarParticipanteVisible = false;
  }

  crearEntrevista(entrevistaCreada: Entrevista) {
    if (!entrevistaCreada?.entrevista?.identrevista) return;

    crear(this.entrevistas, entrevistaCreada);
  }

  eliminarEntrevista(entrevistaEliminada: Entrevista) {
    this.entrevistas.update((arr) =>
      arr.filter(
        (entrevista) =>
          entrevista.entrevista.identrevista !== entrevistaEliminada.entrevista.identrevista,
      ),
    );
    /*eliminar(this.entrevistas, entrevistaEliminada.entrevista, 'identrevista'); no funciona, tendría que extender la función para que soporte anidamiento*/
  }

  editarEntrevista(entrevistaEditada: Entrevista) {
    this.entrevistas.update((entrevistas) =>
      entrevistas.map((entrevista) =>
        entrevista.entrevista.identrevista === entrevistaEditada.entrevista.identrevista
          ? entrevistaEditada
          : entrevista,
      ),
    );
  }

  registrarParticipante(participanteRegistrado: Participante) {
    crear(this.participantes, participanteRegistrado);
  }
}
