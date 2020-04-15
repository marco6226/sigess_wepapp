import { OpcionRespuesta } from './opcion-respuesta'
import { Documento } from 'app/modulos/ado/entities/documento'

export class Elemento {
  id: string;
  nombre: string;
  codigo: string;
  marcoLegal: string;
  criterio: string;
  modoVerificacion: string;

  elementoList: Elemento[] = [];
  opcionRespuestaList: OpcionRespuesta[] = [];
  documentosList: Documento[];
}
