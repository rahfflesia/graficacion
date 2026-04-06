import { Participante } from './participantesProyecto.interface';

export interface DatosFormularioObservacion {
  nombre: string;
  descripcion: string;
  idObservador: number;
  lugar: string;
  fechaHoraCaptura?: Date | string;
  listaObservados?: Participante[];
  tipo: 'Pasiva' | 'Activa';
  idSubproceso: number;
}
