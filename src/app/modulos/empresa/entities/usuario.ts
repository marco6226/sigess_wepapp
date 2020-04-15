
import { UsuarioEmpresa } from 'app/modulos/empresa/entities/usuario-empresa'

export class Usuario {
  id: string;
  email: string;
  perfilesId: string[];
  perfilNombre: string;
  estado: string;
  usuarioEmpresaList: UsuarioEmpresa[];
  avatar: string;
  icon: string;
  ultimoLogin: Date;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaAceptaTerminos: Date;
  ipPermitida: string[];
  numeroMovil:string;
  mfa:boolean;
}
