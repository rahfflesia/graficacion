export interface DiagramaClase {
  iddiagrama?: number;
  idproyecto: number;
  nombre: string;
  tipo: 'clase' | 'secuencia' | 'casos_uso' | 'paquetes';
  contenido: any;
  ultimaedicion?: string;
}
