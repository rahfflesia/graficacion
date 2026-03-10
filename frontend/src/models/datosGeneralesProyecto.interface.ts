import { Participante } from './participantesProyecto.interface';
import { Proceso } from './procesos.interface';
import { Rol } from './rol.interface';
import { Subproceso } from './subprocesos.interface';

interface DatosGeneralesProyecto {
  roles: Rol[];
  procesos: Proceso[];
  subprocesos: Subproceso[];
  participantes: Participante[];
}

export type { DatosGeneralesProyecto };
