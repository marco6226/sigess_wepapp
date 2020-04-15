import { Fuente } from './fuente'
import { Efecto } from './efecto'
import { Control } from './control'
import { TipoPeligro } from './tipo-peligro'

export class Peligro {
  id: string;
  nombre: string;
  tipoPeligro: TipoPeligro;
  fuenteList: Fuente[];
  controlList: Control[];
  efectoList: Efecto[];
}