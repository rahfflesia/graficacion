import { Participante } from './participantesProyecto.interface';
// los ids son opcionales porque cuando creo las preguntas no hay una forma de asignarles esta información
// en cambio cuando hago get sí me los da el backend, ya que, los necesito
// en pocas palabras son opcionales para no tener que hacer 3 interfaces con campos muy similares donde la unica diferencia son los ids
interface PreguntaEntrevista {
  idpregunta?: number;
  identrevista?: number;
  nombre: string;
  descripcion: string;
}

// Igual acá
export interface DatosEntrevista {
  identrevista?: number;
  idsubproceso: number;
  nombre: string;
  descripcion: string;
  identrevistador: number;
  fechahorainicio: string;
  fechahorafinalizacion: string;
  lugar: string;
}

// Acá para hacer el delete nomás ocupo el id de la entrevista por eso marco como opcionales los array
export interface Entrevista {
  entrevista: DatosEntrevista;
  entrevistados?: Participante[];
  preguntasentrevista?: PreguntaEntrevista[];
}
