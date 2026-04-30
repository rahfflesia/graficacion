export interface DatosFormularioAnalisis {
  idsubproceso: number;
  nombre: string;
  descripcion: string;
  idanalista: number;
  tipodocumento: string;
  fuente: string;
  fechaanalisis?: string;
  notas?: string;
  hallazgos: string[];
}

export interface AnalisisDocumento {
  idanalisis: number;
  idsubproceso: number;
  nombre: string;
  descripcion: string;
  idanalista: number;
  tipodocumento: string;
  fuente: string;
  fechaanalisis: string;
  notas: string | null;
  hallazgosanalisis: HallazgoAnalisis[];
  personas: {
    idpersona: number;
    nombre: string;
    apellidouno: string;
    apellidodos: string | null;
  };
}

export interface HallazgoAnalisis {
  idhallazgo: number;
  idanalisis: number;
  hallazgo: string;
}
