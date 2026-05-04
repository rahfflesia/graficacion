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
  estaCargando = true;

  constructor() {
    const datosNavegacion = this.router.currentNavigation();
    if (!datosNavegacion?.extras.state) return;
    const datosTecnica = datosNavegacion?.extras.state['datosTecnica'];

    this.subproceso.set(datosTecnica.subproceso);
    this.participantes.set(datosTecnica.participantes);
    this.idproyecto.set(datosTecnica.idproyecto);
  }

  ngOnInit(): void {
    console.log(this.idproyecto());
    const idSubproceso = this.subproceso()?.idsubproceso;

    if (!idSubproceso) {
      console.error('El id del subproceso no se encuentra definido');
      return;
    }

    this.api.obtenerEntrevistas(idSubproceso).subscribe({
      next: (entrevistas) => {
        this.entrevistas.set(entrevistas);
        this.estaCargando = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al obtener las entrevistas');
        this.estaCargando = false;
      },
    });
  }

  mostrarModalAgregarParticipante() {
    this.esModalAgregarParticipanteVisible = true;
  }

  ocultarModalAgregarParticipante() {
    this.esModalAgregarParticipanteVisible = false;
  }

  crearEntrevista(entrevistaCreada: Entrevista) {
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
