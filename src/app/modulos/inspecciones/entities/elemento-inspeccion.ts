
import { Calificacion } from 'app/modulos/inspecciones/entities/calificacion'
import { TipoHallazgo } from './tipo-hallazgo';

export class ElementoInspeccion {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  elementoInspeccionPadre: ElementoInspeccion;
  elementoInspeccionList: ElementoInspeccion[] = [];
  calificable: boolean;
  tipoHallazgoList:TipoHallazgo[];

  numero: number;
  calificacion: Calificacion;
}
