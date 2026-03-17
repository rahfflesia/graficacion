import { TecnicaRecoleccion } from './tecnicasRecoleccion.interface';

interface DatosFormularioSubproceso {
  nombreSubproceso: string;
  descripcionSubproceso: string;
  idProcesoAsociado: number;
  tecnicasSeleccionadas: TecnicaRecoleccion[];
}

interface Subproceso {
  nombresubproceso: string;
  nombreproceso: string;
  descripcionsubproceso: string;
  fechacreacion: Date;
  idproceso: number;
  idsubproceso: number;
  tecnicasasociadas: TecnicaRecoleccion[];
}

export type { DatosFormularioSubproceso, Subproceso };
