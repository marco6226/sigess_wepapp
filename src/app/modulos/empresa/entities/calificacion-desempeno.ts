import { Competencia } from "./competencia";
import { EvaluacionDesempeno } from "./evaluacion-desempeno";


export class CalificacionDesempeno {
  id?: string;
  puntaje?: number;
  competencia?: Competencia;
  evaluacionDesempeno?: EvaluacionDesempeno;
}