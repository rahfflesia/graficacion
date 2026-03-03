import { Proceso } from './procesos.interface';
import { Rol } from './rol.interface';
import { Subproceso } from './subprocesos.interface';

interface DatosGeneralesProyecto {
  roles: Rol[];
  procesos: Proceso[];
  subprocesos: Subproceso[];
  rolesparticipantesproyecto: any[];
}

export type { DatosGeneralesProyecto };
