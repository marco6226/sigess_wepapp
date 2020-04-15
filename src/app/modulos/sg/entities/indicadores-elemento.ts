import { Elemento } from './elemento'
export class IndicadoresElemento {
  nivelCumplimiento: number;
  puntajeBruto: number;
  numeroPreguntas: number;
  totalPreguntas: number;
  contestadas: number;
  restantes: number;
  porcentaje: number;
  finalizada: boolean;
  elemento: Elemento;
}
