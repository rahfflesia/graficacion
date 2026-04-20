import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Participante } from '../../../models/participantesProyecto.interface';
import { Subproceso } from '../../../models/subprocesos.interface';
import { AnalisisDocumento, DatosFormularioAnalisis } from '../../../models/analisisDocumento';
import { Api } from '../../../servicios/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'seccion-analisis-documento',
  imports: [ReactiveFormsModule],
  templateUrl: './seccion-analisis-documento.html',
  styleUrl: './seccion-analisis-documento.css',
})
export class SeccionAnalisisDocumento {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  subproceso: Subproceso | undefined = undefined;
  participantes = signal<Participante[]>([]);
  analisisExistentes = signal<AnalisisDocumento[]>([]);
  analisisEnEdicion = signal<AnalisisDocumento | null>(null);

  tiposDocumento = [
    'Informe técnico',
    'Manual',
    'Especificación de requisitos',
    'Acta de reunión',
    'Contrato',
    'Ley / Regulación',
    'Estudio de caso',
    'Reporte',
    'Otro',
  ];

  formulario = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    idanalista: ['', [Validators.required]],
    tipodocumento: ['', [Validators.required]],
    fuente: ['', [Validators.required]],
    fechaanalisis: [''],
    notas: [''],
    hallazgos: this.formBuilder.array([], [Validators.required]),
  });

  constructor() {
    const datosNavegacion = this.router.currentNavigation();
    if (!datosNavegacion?.extras.state) return;

    const datosTecnica = datosNavegacion.extras.state['datosTecnica'];
    if (!datosTecnica) return;

    this.participantes.set(datosTecnica.participantes ?? []);
    this.subproceso = datosTecnica.subproceso;

    this.cargarAnalisisExistentes();
  }

  get hallazgosFormArray(): FormArray {
    return this.formulario.get('hallazgos') as FormArray;
  }

  agregarHallazgo() {
    this.hallazgosFormArray.push(this.formBuilder.control('', Validators.required));
  }

  eliminarHallazgo(i: number) {
    this.hallazgosFormArray.removeAt(i);
  }

  cargarAnalisisExistentes() {
    if (!this.subproceso?.idsubproceso) return;
    this.api.obtenerAnalisisDocumentos(this.subproceso.idsubproceso).subscribe({
      next: (lista) => this.analisisExistentes.set(lista),
      error: (e) => console.error('Error al cargar análisis:', e),
    });
  }

  crearAnalisis() {
    const v = this.formulario.value;
    const datos: DatosFormularioAnalisis = {
      idsubproceso: this.subproceso!.idsubproceso,
      nombre: v.nombre!,
      descripcion: v.descripcion!,
      idanalista: parseInt(v.idanalista!),
      tipodocumento: v.tipodocumento!,
      fuente: v.fuente!,
      notas: v.notas || undefined,
      hallazgos: (this.hallazgosFormArray.controls.map((c) => c.value) as string[]).filter(Boolean),
      ...(v.fechaanalisis ? { fechaanalisis: v.fechaanalisis } : {}),
    };

    this.api.crearAnalisisDocumento(datos).subscribe({
      next: () => {
        this.toastr.success('Análisis de documento creado exitosamente');
        this.resetFormulario();
        this.cargarAnalisisExistentes();
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Error al crear el análisis', '', { toastClass: 'toastr-error' });
      },
    });
  }

  eliminarAnalisis(id: number) {
    this.api.eliminarAnalisisDocumento(id).subscribe({
      next: () => {
        this.toastr.success('Análisis eliminado');
        this.cargarAnalisisExistentes();
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Error al eliminar', '', { toastClass: 'toastr-error' });
      },
    });
  }

  cargarParaEdicion(a: AnalisisDocumento) {
    this.analisisEnEdicion.set(a);

    const fechaFormateada = a.fechaanalisis
      ? new Date(a.fechaanalisis).toISOString().slice(0, 16)
      : '';

    this.formulario.patchValue({
      nombre: a.nombre,
      descripcion: a.descripcion,
      idanalista: String(a.idanalista),
      tipodocumento: a.tipodocumento,
      fuente: a.fuente,
      fechaanalisis: fechaFormateada,
      notas: a.notas ?? '',
    });

    this.hallazgosFormArray.clear();
    a.hallazgosanalisis.forEach((h) => {
      this.hallazgosFormArray.push(this.formBuilder.control(h.hallazgo, Validators.required));
    });
  }

  cancelarEdicion() {
    this.analisisEnEdicion.set(null);
    this.resetFormulario();
  }

  editarAnalisis() {
    const a = this.analisisEnEdicion();
    if (!a) return;
    const v = this.formulario.value;
    const datos: DatosFormularioAnalisis = {
      idsubproceso: this.subproceso!.idsubproceso,
      nombre: v.nombre!,
      descripcion: v.descripcion!,
      idanalista: parseInt(v.idanalista!),
      tipodocumento: v.tipodocumento!,
      fuente: v.fuente!,
      notas: v.notas || undefined,
      hallazgos: (this.hallazgosFormArray.controls.map((c) => c.value) as string[]).filter(Boolean),
      ...(v.fechaanalisis ? { fechaanalisis: v.fechaanalisis } : {}),
    };

    this.api.editarAnalisisDocumento(a.idanalisis, datos).subscribe({
      next: () => {
        this.toastr.success('Análisis actualizado');
        this.cancelarEdicion();
        this.cargarAnalisisExistentes();
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('Error al actualizar', '', { toastClass: 'toastr-error' });
      },
    });
  }

  private resetFormulario() {
    this.formulario.reset();
    this.hallazgosFormArray.clear();
  }

  nombreCompleto(p: { nombre: string; apellidouno: string; apellidodos?: string | null }): string {
    return `${p.nombre} ${p.apellidouno}${p.apellidodos ? ' ' + p.apellidodos : ''}`;
  }
}
