import { TipoArea } from './tipo-area'
import { Sede } from './sede'

export class Area {
  id: string;
  nombre: string;
  descripcion: string;
  estructura:string;
  nivel: number;
  tipoArea: TipoArea;
  sede: Sede;
  areaPadre?: Area;
  areaList: Area[];
  contacto: string;
  padreNombre?: string;

  numero: number;

  public nombreTipoArea(): string {
    return this.tipoArea.nombre;
  }
}

export enum Estructura {
  ORGANIZACIONAL = <any>'ORGANIZACIONAL',
  FISICA = <any>"FISICA"
}