import { Participante } from './participantesProyecto.interface';

export interface SeguimientoTransaccional {
  idseguimiento?: number;
  nombre: string;
  descripcion: string;
  idsubproceso: number;
  tipotransaccion: 'Manual' | 'Autom_tica' | 'Sistema_externo';
  estado: 'Pendiente' | 'En_proceso' | 'Finalizado' | 'Error';
  idresponsable: number;
  fechaejecucion: string;
  resultadoesperado: string;
  resultadoobtenido: string;
  fechacreacion?: string;
  fechaactualizacion?: string;
  responsable?: Participante;
  involucradosseguimiento?: Participante[];
}
