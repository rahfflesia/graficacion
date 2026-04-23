import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';
import { Rol } from '../../../models/rol.interface';
import {
  DatosFormularioParticipante,
  Participante,
} from '../../../models/participantesProyecto.interface';

@Component({
  selector: 'modal-agregar-participante',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-agregar-participante.html',
  styleUrl: '../modal-configuracion-proyecto/modal-configuracion-proyecto.css',
})
export class ModalAgregarParticipante implements OnInit {
  formBuilder = inject(FormBuilder);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  @Input() toggler = false;
  @Input() idProyecto: number | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() participanteCreado = new EventEmitter<Participante>();

  roles = signal<Rol[]>([]);

  formularioParticipantes = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    apellidoUno: ['', [Validators.required]],
    apellidoDos: [''],
    correo: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    idrol: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const idProyecto = this.idProyecto;

    if (!idProyecto) {
      console.error('El id del proyecto no se encuentra definido');
      return;
    }

    this.api.obtenerRolesProyecto(idProyecto).subscribe({
      next: (roles) => {
        this.roles.set(roles);
        console.log(roles);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al obtener los roles', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }

  obtenerControlFormularioParticipantes(nombreControl: string) {
    return this.formularioParticipantes.get(nombreControl);
  }

  registrarParticipante() {
    const datosParticipante: DatosFormularioParticipante = {
      ...this.formularioParticipantes.value,
      idrol: Number(this.formularioParticipantes.get('idrol')?.value),
      idproyecto: this.idProyecto,
    } as DatosFormularioParticipante;

    this.api.registrarParticipante(datosParticipante).subscribe({
      next: (participante) => {
        this.toastr.success('Participante registrado exitosamente');
        console.log('Se ha registrado el siguiente participante', participante);
        this.participanteCreado.emit(participante);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Ha ocurrido un error al registrar el participante', '', {
          toastClass: 'toastr-error',
        });
      },
    });
    this.cerrar.emit();
    this.formularioParticipantes.reset();
    this.formularioParticipantes.get('idrol')?.setValue(this.roles()![0].idrol.toString());
  }
}
