
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { Permiso } from 'app/modulos/empresa/entities/permiso';
import { Empresa } from 'app/modulos/empresa/entities/empresa';
import { Empleado } from 'app/modulos/empresa/entities/empleado';

export class Session {
  token: string;
  recordar: boolean;
  usuario: Usuario;
  empleado: Empleado;
  isLoggedIn: boolean;
  empresa: Empresa;
  permisosList: Permiso[];
  permisosMap: Map<string, boolean>;
  configuracion: Map<string, any>;
}
