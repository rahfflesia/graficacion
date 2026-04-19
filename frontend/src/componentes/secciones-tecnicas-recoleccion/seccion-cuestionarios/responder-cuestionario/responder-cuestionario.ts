import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cuestionario, DatosRespuestaCuestionario } from '../../../../models/cuestionario';
import { Participante } from '../../../../models/participantesProyecto.interface';
import { Api } from '../../../../servicios/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'responder-cuestionario',
  imports: [ReactiveFormsModule],
  templateUrl: './responder-cuestionario.html',
  styleUrl: './responder-cuestionario.css',
})
export class ResponderCuestionario {
  private formBuilder = inject(FormBuilder);
  private api = inject(Api);
  private toastr = inject(ToastrService);

  @Input() cuestionario!: Cuestionario;
  @Input() participantes: Participante[] = [];
  @Output() respuestaGuardada = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  formularioRespuesta!: FormGroup;

  ngOnInit() {
    this.formularioRespuesta = this.formBuilder.group({
      idRespondente: ['', Validators.required],
      respuestas: this.formBuilder.array(
        this.cuestionario.preguntascuestionario.map((pregunta) =>
          this.formBuilder.group({
            idPregunta: [pregunta.idpregunta],
            valor: ['', Validators.required],
          })
        )
      ),
    });
  }

  get respuestasFormArray(): FormArray {
    return this.formularioRespuesta.get('respuestas') as FormArray;
  }

  guardarRespuesta() {
    const datos: DatosRespuestaCuestionario = {
      idCuestionario: this.cuestionario.idicuestionario,
      idRespondente: parseInt(this.formularioRespuesta.value.idRespondente),
      respuestas: this.formularioRespuesta.value.respuestas,
    };

    this.api.responderCuestionario(datos).subscribe({
      next: () => {
        this.toastr.success('Respuesta guardada exitosamente');
        this.respuestaGuardada.emit();
      },
      error: (error) => {
        console.error('Error al guardar respuesta:', error);
        this.toastr.error('Error al guardar la respuesta', '', {
          toastClass: 'toastr-error',
        });
      },
    });
  }
}