import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Participante } from '../../../models/participantesProyecto.interface';
import { Subproceso } from '../../../models/subprocesos.interface';
import { FocusGroup, DatosFormularioFocusGroup } from '../../../models/focusGroup';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'seccion-focus-group',
  imports: [ReactiveFormsModule],
  templateUrl: './seccion-focus-group.html',
  styleUrl: './seccion-focus-group.css',
})
export class SeccionFocusGroup {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  subproceso: Subproceso | undefined = undefined;
  participantes = signal<Participante[]>([]);
  focusGroupsExistentes = signal<FocusGroup[]>([]);
  focusGroupEnEdicion = signal<FocusGroup | null>(null);

  formulario = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    idmoderador: ['', [Validators.required]],
    lugar: ['', [Validators.required]],
    fechahora: [''],
    temas: this.formBuilder.array([], [Validators.required]),
    participantes: this.formBuilder.array([]),
  });

  constructor() {
    const datosNavegacion = this.router.currentNavigation();
    if (!datosNavegacion?.extras.state) return;

    const datosTecnica = datosNavegacion.extras.state['datosTecnica'];
    if (!datosTecnica) return;

    this.participantes.set(datosTecnica.participantes ?? []);
    this.subproceso = datosTecnica.subproceso;

    this.inicializarParticipantes();
    this.cargarFocusGroupsExistentes();
  }

  inicializarParticipantes() {
    const participantesArray = this.formulario.get('participantes') as FormArray;
    participantesArray.clear();
    this.participantes().forEach(() => {
      participantesArray.push(this.formBuilder.control(false));
    });
  }

  get temasFormArray(): FormArray {
    return this.formulario.get('temas') as FormArray;
  }

  get participantesFormArray(): FormArray {
    return this.formulario.get('participantes') as FormArray;
  }

  agregarTema() {
    this.temasFormArray.push(this.formBuilder.control('', Validators.required));
  }

  eliminarTema(indice: number) {
    this.temasFormArray.removeAt(indice);
  }

  obtenerParticipantesSeleccionados(): number[] {
    return this.participantes()
      .filter((_, i) => this.participantesFormArray.at(i).value)
      .map((p) => p.idpersona);
  }

  cargarFocusGroupsExistentes() {
    if (!this.subproceso?.idsubproceso) return;
    this.api.obtenerFocusGroups(this.subproceso.idsubproceso).subscribe({
      next: (lista) => this.focusGroupsExistentes.set(lista),
      error: (e) => console.error('Error al cargar focus groups:', e),
    });
  }

  crearFocusGroup() {
    const v = this.formulario.value;
    const datos: DatosFormularioFocusGroup = {
      idsubproceso: this.subproceso!.idsubproceso,
      nombre: v.nombre!,
      descripcion: v.descripcion!,
      idmoderador: parseInt(v.idmoderador!),
      lugar: v.lugar!,
      temas: (this.temasFormArray.controls.map((c) => c.value) as string[]).filter(Boolean),
      participantes: this.obtenerParticipantesSeleccionados(),
      ...(v.fechahora ? { fechahora: v.fechahora } : {}),
    };

    this.api.crearFocusGroup(datos).subscribe({
      next: () => {
        this.toastr.success('Focus Group creado exitosamente');
        this.resetFormulario();
        this.cargarFocusGroupsExistentes();
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Error al crear el Focus Group', '', { toastClass: 'toastr-error' });
      },
    });
  }

  eliminarFocusGroup(id: number) {
    this.api.eliminarFocusGroup(id).subscribe({
      next: () => {
        this.toastr.success('Focus Group eliminado');
        this.cargarFocusGroupsExistentes();
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Error al eliminar', '', { toastClass: 'toastr-error' });
      },
    });
  }

  cargarParaEdicion(fg: FocusGroup) {
    this.focusGroupEnEdicion.set(fg);

    const fechaFormateada = fg.fechahora
      ? new Date(fg.fechahora).toISOString().slice(0, 16)
      : '';

    this.formulario.patchValue({
      nombre: fg.nombre,
      descripcion: fg.descripcion,
      idmoderador: String(fg.idmoderador),
      lugar: fg.lugar,
      fechahora: fechaFormateada,
    });

    this.temasFormArray.clear();
    fg.temasfocusgroup.forEach((t) => {
      this.temasFormArray.push(this.formBuilder.control(t.tema, Validators.required));
    });

    const idsParticipantes = fg.participantesfg.map((p) => p.idpersona);
    this.participantesFormArray.controls.forEach((ctrl, i) => {
      ctrl.setValue(idsParticipantes.includes(this.participantes()[i]?.idpersona));
    });
  }

  cancelarEdicion() {
    this.focusGroupEnEdicion.set(null);
    this.resetFormulario();
  }

  editarFocusGroup() {
    const fg = this.focusGroupEnEdicion();
    if (!fg) return;
    const v = this.formulario.value;
    const datos: DatosFormularioFocusGroup = {
      idsubproceso: this.subproceso!.idsubproceso,
      nombre: v.nombre!,
      descripcion: v.descripcion!,
      idmoderador: parseInt(v.idmoderador!),
      lugar: v.lugar!,
      temas: (this.temasFormArray.controls.map((c) => c.value) as string[]).filter(Boolean),
      participantes: this.obtenerParticipantesSeleccionados(),
      ...(v.fechahora ? { fechahora: v.fechahora } : {}),
    };

    this.api.editarFocusGroup(fg.idfocusgroup, datos).subscribe({
      next: () => {
        this.toastr.success('Focus Group actualizado');
        this.cancelarEdicion();
        this.cargarFocusGroupsExistentes();
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Error al actualizar', '', { toastClass: 'toastr-error' });
      },
    });
  }

  private resetFormulario() {
    this.formulario.reset();
    this.temasFormArray.clear();
    this.inicializarParticipantes();
  }

  nombreCompleto(p: { nombre: string; apellidouno: string; apellidodos?: string | null }): string {
    return `${p.nombre} ${p.apellidouno}${p.apellidodos ? ' ' + p.apellidodos : ''}`;
  }
}
