import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeguimientoTransaccional } from '../../../models/seguimientoTransaccional';
import { Participante } from '../../../models/participantesProyecto.interface';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'modal-editar-seguimiento-transaccional',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-editar-seguimiento-transaccional.html',
  styleUrl: './modal-editar-seguimiento-transaccional.css',
})
export class ModalEditarSeguimientoTransaccional implements OnChanges {
  @Input() toggler = false;
  @Input() seguimientoTransaccional: SeguimientoTransaccional | null = null;
  @Input() participantes: Participante[] = [];

  @Output() cerrar = new EventEmitter<void>();
  @Output() editarSeguimiento = new EventEmitter<SeguimientoTransaccional>();

  private fb = inject(FormBuilder);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  formularioSeguimiento = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    tipotransaccion: ['', Validators.required],
    estado: ['', Validators.required],
    idresponsable: ['', Validators.required],
    fechaejecucion: ['', Validators.required],
    resultadoesperado: ['', Validators.required],
    resultadoobtenido: ['', Validators.required],
    campobusqueda: [''],
  });

  participantesFiltrados: { participante: Participante; indiceOriginal: number }[] = [];
  listaInvolucrados: Participante[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['seguimientoTransaccional']) {
      const seguimiento = this.seguimientoTransaccional;

      if (!seguimiento) return;

      this.formularioSeguimiento.patchValue({
        nombre: seguimiento.nombre,
        descripcion: seguimiento.descripcion,
        tipotransaccion: seguimiento.tipotransaccion,
        estado: seguimiento.estado,
        idresponsable: seguimiento.idresponsable.toString(),
        fechaejecucion: this.formatearFechaInput(seguimiento.fechaejecucion),
        resultadoesperado: seguimiento.resultadoesperado,
        resultadoobtenido: seguimiento.resultadoobtenido,
      });

      this.listaInvolucrados = [...seguimiento.involucradosseguimiento!];
    }
  }

  formatearFechaInput(fecha: string | Date) {
    const fechaObjeto = new Date(fecha);
    const year = fechaObjeto.getFullYear();
    const month = String(fechaObjeto.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObjeto.getDate()).padStart(2, '0');
    const hours = String(fechaObjeto.getHours()).padStart(2, '0');
    const minutes = String(fechaObjeto.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  obtenerControlFormulario(nombreControl: string) {
    return this.formularioSeguimiento.get(nombreControl);
  }

  filtrarParticipantes() {
    if (!this.participantes) {
      console.error('La lista de participantes no se encuentra definida');
      return;
    }

    const valorCampoBusqueda = this.formularioSeguimiento.value.campobusqueda ?? '';

    this.participantesFiltrados = this.participantes
      .map((participante, index) => ({ participante, indiceOriginal: index }))
      .filter(({ participante }) => {
        const nombreCompleto = `${participante.nombre} ${participante.apellidouno} ${participante.apellidodos ?? ''}`;
        return nombreCompleto.toLowerCase().includes(valorCampoBusqueda.toLowerCase());
      });
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
  }

  eliminarInvolucrado(indice: number) {
    this.listaInvolucrados.splice(indice, 1);

    this.listaInvolucrados = [...this.listaInvolucrados];

    const campoBusqueda = this.obtenerControlFormulario('campobusqueda');

    campoBusqueda?.updateValueAndValidity();

    campoBusqueda?.markAsDirty();
  }

  editarSeguimientoTransaccional() {
    const datosSeguimientoTransaccional: SeguimientoTransaccional = {
      idseguimiento: this.seguimientoTransaccional?.idseguimiento!,
      nombre: this.formularioSeguimiento.value.nombre!,
      descripcion: this.formularioSeguimiento.value.descripcion!,
      idsubproceso: this.seguimientoTransaccional?.idsubproceso!,
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

    this.api.editarSeguimientoTransaccional(datosSeguimientoTransaccional).subscribe({
      next: (seguimientoEditado) => {
        this.toastr.success('Seguimiento transaccional editado correctamente');
        this.editarSeguimiento.emit(seguimientoEditado);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('', 'Ha ocurrido un error al editar el seguimiento transaccional', {
          toastClass: 'toastr-error',
        });
      },
    });

    this.cerrar.emit();
  }
}
