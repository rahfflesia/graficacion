export interface Rol {
  idrol?: number;
  nombre: string;
  tipo: 'Interno' | 'Externo';
  idproyecto: number;
}
