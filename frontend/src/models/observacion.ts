import { Participante } from './participantesProyecto.interface';

export interface DatosFormularioObservacion {
  nombre: string;
  descripcion: string;
  idobservador: number;
  lugar: string;
  fechahoracaptura?: Date | string;
  listaobservados?: Participante[];
  tipo: 'Pasiva' | 'Activa';
  idsubproceso: number;
}

export interface Observacion {
  idobservacion?: number;
  idsubproceso?: number;
  nombre: string;
  descripcion: string;
  idobservador: number;
  lugar: string;
  tipo: 'Pasiva' | 'Activa';
  fechahoracaptura: Date;
  listaparticipantes?: Participante[];
  observador?: Participante;
}
