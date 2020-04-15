
import { Usuario } from 'app/modulos/empresa/entities/usuario';
import { Permiso } from 'app/modulos/empresa/entities/permiso';
import { Empresa } from 'app/modulos/empresa/entities/empresa';

export class Session {
  token: string;
  recordar: boolean;
  usuario: Usuario;
  isLoggedIn: boolean;
  empresa: Empresa;
  permisosList: Permiso[];
  permisosMap: Map<string, boolean>;
  configuracion: Map<string, any>;
}
