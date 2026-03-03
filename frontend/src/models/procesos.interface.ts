interface DatosProceso {
  idProyecto: number | undefined;
  nombreProceso: string;
  descripcionProceso: string;
}

interface Proceso {
  idproyecto: number;
  idproceso: number;
  nombre: string;
  descripcion: string;
  fechacreacion: Date;
}

interface DatosEditarProceso {
  nombreProceso: string;
  descripcionProceso: string;
}

export type { Proceso, DatosProceso, DatosEditarProceso };
