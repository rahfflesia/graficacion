interface DatosSubproceso {}

interface Subproceso {
  nombreproceso: string;
  nombresubproceso: string;
  descripcionsubproceso: string;
  fechacreacion: Date;
  idproceso: number;
  idsubproceso: number;
}

export type { DatosSubproceso, Subproceso };
