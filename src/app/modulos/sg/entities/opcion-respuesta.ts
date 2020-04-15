import { Elemento } from './elemento'

export class OpcionRespuesta {
  id: string;
  nombre: string;
  valor: number;
  descripcion: string;
  despreciable: boolean;
  elemento: Elemento;

  classUI:string;
}
