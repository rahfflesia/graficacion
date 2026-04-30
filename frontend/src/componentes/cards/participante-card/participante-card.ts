import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  DatosEditarParticipante,
  Participante,
  RolParticipanteProyecto,
} from '../../../models/participantesProyecto.interface';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rol } from '../../../models/rol.interface';

@Component({
  selector: 'participante-card',
  imports: [ReactiveFormsModule],
  templateUrl: './participante-card.html',
  styleUrl: './participante-card.css',
})
export class ParticipanteCard implements OnInit {
  @Input() participante: Participante | undefined;
  @Input() roles: Rol[] = [];
  @Output() borrarParticipante = new EventEmitter<RolParticipanteProyecto>();
  @Output() editar = new EventEmitter<Participante>();

  estaEditando = false;
  estaBorrando = false;

  private api = inject(Api);
  private toastr = inject(ToastrService);
  private formBuilder = inject(FormBuilder);

  formularioEditarParticipante = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    apellidouno: ['', [Validators.required]],
    apellidodos: ['', [Validators.required]],
    correo: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    idrol: ['', [Validators.required]],
  });

  ngOnInit(): void {
    console.log('Datos del participante', this.participante);
  }

  obtenerControlFormularioEditarParticipante(nombreControl: string) {
    return this.formularioEditarParticipante.get(nombreControl);
  }

  mostrarMenuEditar() {
    this.estaEditando = true;

    this.formularioEditarParticipante.setValue({
      nombre: this.participante?.nombre ?? 'Nombre',
      apellidouno: this.participante?.apellidouno ?? 'Apellido uno',
      apellidodos: this.participante?.apellidodos ?? 'Apellido dos',
      correo: this.participante?.correo ?? 'Correo',
      telefono: this.participante?.telefono ?? 'Telefono',
      idrol: this.participante?.idrol!.toString() ?? '1',
    });
  }

  ocultarMenuEditar() {
    this.estaEditando = false;
  }

  mostrarMenuBorrar() {
    this.estaBorrando = true;
  }

  ocultarMenuBorrar() {
    this.estaBorrando = false;
  }

  editarParticipante() {
    const idpersona = this.participante?.idpersona;
    const idrolpersonaproyecto = this.participante?.idrolpersonaproyecto;

    if (!idpersona || !idrolpersonaproyecto) {
      console.error('Los ids del participante no están definidos');
      return;
    }

    const datosFormulario = this.formularioEditarParticipante.value;

    // Así lo voy a dejar por mientras luego hago bien las validaciones
    const datosEditarParticipante = {
      nombre: datosFormulario.nombre ?? '',
      apellidouno: datosFormulario.apellidouno ?? '',
      // Este es el único campo que puede ser nulo
      apellidodos: datosFormulario.apellidodos ?? null,
      correo: datosFormulario.correo ?? '',
      telefono: datosFormulario.telefono ?? '',
      idrol: Number(datosFormulario.idrol),
      idpersona,
      idrolpersonaproyecto,
    };

    this.api.editarParticipante(idpersona, datosEditarParticipante).subscribe({
      next: (participanteEditado) => {
        this.toastr.success('Se ha editado el participante correctamente');
        this.editar.emit(participanteEditado);
        console.log(participanteEditado);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al editar el participante', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  eliminarParticipante() {
    const idParticipante = this.participante?.idrolpersonaproyecto;

    if (!idParticipante) {
      console.error('El id del participante es nulo');
      return;
    }

    this.api.eliminarParticipante(idParticipante).subscribe({
      next: (participanteEliminado) => {
        this.toastr.success('Participante eliminado correctamente');
        this.borrarParticipante.emit(participanteEliminado);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al eliminar al participante', '', {
          toastClass: 'toastr-error',
        });
      },
    });
    this.ocultarMenuBorrar();
  }
}
