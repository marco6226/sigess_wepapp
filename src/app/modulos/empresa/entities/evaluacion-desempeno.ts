import { Empleado } from "./empleado";
import { Cargo } from "./cargo";
import { Usuario } from "./usuario";
import { CalificacionDesempeno } from "./calificacion-desempeno";


export class EvaluacionDesempeno {
  id: string;
  fechaElaboracion: Date;
  empleado: Empleado;
  cargo: Cargo;
  usuarioElabora: Usuario;
  calificacionDesempenoList: CalificacionDesempeno[];
  comentario:string;
}