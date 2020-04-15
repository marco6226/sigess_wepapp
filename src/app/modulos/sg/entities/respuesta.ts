import { Evaluacion } from 'app/modulos/sg/entities/evaluacion'
import { OpcionRespuesta } from 'app/modulos/sg/entities/opcion-respuesta'

export class Respuesta {
  id: string;
  actividad: string;
  responsable: string;
  recursos: string;
  meta: string;  
  evaluacion: Evaluacion;
  opcionRespuesta: OpcionRespuesta;
}
