export interface Pregunta {
  textoPregunta: string;
  tipoPregunta: 'Abierta' | 'Opción múltiple' | 'Escala';
  opciones: string[];
}

export interface DatosFormularioCuestionario {
  idSubproceso: number;
  nombre: string;
  descripcion: string;
  idCreador: number;
  preguntas: Pregunta[];
}

export interface Cuestionario {
  idicuestionario: number;
  idsubproceso: number;
  nombre: string;
  descripcion: string;
  idcreador: number;
  fechacreacion: Date;
  preguntascuestionario: PreguntaCuestionario[];
}

export interface PreguntaCuestionario {
  idpregunta: number;
  idcuestionario: number;
  textopregunta: string;
  tipopregunta: 'Abierta' | 'Opción múltiple' | 'Escala';
  opciones: string[];
  orden: number;
}