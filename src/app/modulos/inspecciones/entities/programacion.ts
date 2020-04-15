
import { ListaInspeccion } from 'app/modulos/inspecciones/entities/lista-inspeccion'
import { Area } from 'app/modulos/empresa/entities/area'

export class Programacion {
  id: string;
  numeroInspecciones: number;
  numeroRealizadas: number;
  fecha: Date;
  area: Area;
  listaInspeccion: ListaInspeccion;
}
