import { TipoSede } from './tipo-sede'
import { Ciudad } from 'app/modulos/comun/entities/ciudad'
import {Empresa} from 'app/modulos/empresa/entities/empresa'

export class Sede {
  id: string;
  direccion: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  nombre: string;
  principal: boolean;
  tipoSede: string;
  empresa: Empresa;
  ciudad: Ciudad;

}
