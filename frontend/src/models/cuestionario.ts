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

export interface RespuestaPregunta {
  idPregunta: number;
  valor: string;
}

export interface DatosRespuestaCuestionario {
  idCuestionario: number;
  idRespondente: number;
  respuestas: RespuestaPregunta[];
}

export interface RespuestaCuestionario {
  idrespuesta: number;
  idcuestionario: number;
  idrespondente: number;
  fecharespuesta: Date;
  personas: {
    idpersona: number;
    nombre: string;
    apellidouno: string;
    apellidodos: string | null;
  };
  respuestaspreguntas: {
    idrespuestapregunta: number;
    idpregunta: number;
    valor: string;
    preguntascuestionario: PreguntaCuestionario;
  }[];
}