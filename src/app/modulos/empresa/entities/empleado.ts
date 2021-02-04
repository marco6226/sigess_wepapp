import { Area } from './area'
import { Cargo } from './cargo'
import { ConfiguracionJornada } from './configuracion-jornada'
import { Usuario } from './usuario'
import { Ciudad } from 'app/modulos/comun/entities/ciudad'
import { Eps } from 'app/modulos/comun/entities/eps'
import { Ccf } from 'app/modulos/comun/entities/ccf'
import { Afp } from 'app/modulos/comun/entities/afp'
import { HorasExtra } from 'app/modulos/empresa/entities/horas-extra'
import { Documento } from 'app/modulos/ado/entities/documento'

export class Empleado {

    id: string;
    codigo: string;
    direccion: string;
    fechaIngreso: Date;
    fechaNacimiento: Date;
    genero: string;
    numeroIdentificacion: string;
    primerApellido: string;
    primerNombre: string;
    segundoApellido: string;
    segundoNombre: string;
    telefono1: string;
    telefono2: string;
    afp: Afp;
    ccf: Ccf;
    corporativePhone: string;
    emergencyContact: string;
    phoneEmergencyContact: string;
    emailEmergencyContact: string;
    ciudad: Ciudad;
    eps: Eps;
    tipoIdentificacion: any;
    tipoVinculacion: string;
    zonaResidencia: string;
    area: Area;
    cargo: Cargo;
    direccionGerencia: string;
    ciudadGerencia: string;
    businessPartner: Empleado;
    jefeInmediato: Empleado;
    regional: string;
    correoPersonal: string;
    usuario: Usuario;
    configuracionJornadaList: ConfiguracionJornada[];
    horasExtraList: HorasExtra[];
    documentosList: Documento[];
    estado: string;
}
