
import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { Empleado } from 'app/modulos/empresa/entities/empleado';
import { Calificacion } from './calificacion'
import { Programacion } from './programacion'
import { RespuestaCampo } from 'app/modulos/comun/entities/respuesta-campo'
import { ListaInspeccion } from './lista-inspeccion';
import { Area } from '../../empresa/entities/area';

export class Inspeccion {
  id: number;
  fechaRealizada: Date;
  fechaModificacion: Date;  
  observacion: string;
  lugar: string;
  equipo: string;
  marca: string;
  modelo: string;
  serial: string;
  descripcion: string;
  empresa: Empresa;
  calificacionList: Calificacion[];
  respuestasCampoList: RespuestaCampo[];
  programacion: Programacion;
  usuarioRegistra: Usuario;
  usuarioModifica: Usuario;
  // empleadoing: Empleado;
  // empleadohse: Empleado;
  empleado: Empleado;
  listaInspeccion:ListaInspeccion;
  area:Area;

  fechavistohse: Date;
  fkempleadohse: Empleado;
  conceptohse: string

  fechavistoing: Date;
  fkempleadoing: Empleado;
  conceptoing: string;
}
