import { Area } from './../../empresa/entities/area';

export class Desviacion {
  hashId: string;
  modulo: string;
  concepto: string;
  fechaReporte: string;
  aspectoCausante: string;
  nivelRiesgo: string;
  areaNombre: string;
  analisisId: string;
  criticidad?: string;
  empresaId?: number;
  nombre: string;
  hora: string;
  severidad: string;
  furat: string;
  empresa: string;
  nit: string;
  area?: Area;
}
