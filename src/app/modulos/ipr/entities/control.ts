import { TipoControl } from './tipo-control'
import { Peligro } from './peligro'

export class Control {
  id: string;
  nombre: string;
  tipoControl: TipoControl;
  peligro:Peligro;
}