
import { Cargo } from './cargo'
import { ConfiguracionJornada } from './configuracion-jornada'
import { UsuarioBasic } from './usuario-basic'
import { Documento } from 'app/modulos/ado/entities/documento'

export class EmpleadoBasic {

    id: string;
    
    numeroIdentificacion: string;
    primerApellido: string;
    primerNombre: string;
    segundoApellido: string;
    segundoNombre: string;    
    cargo: Cargo;    
    usuario: UsuarioBasic;
    usuarioBasic: UsuarioBasic;
   
   
}
