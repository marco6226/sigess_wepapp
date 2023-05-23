
import { Ciudad } from 'app/modulos/comun/entities/ciudad'
import { Area } from 'app/modulos/empresa/entities/area'
import { Usuario } from 'app/modulos/empresa/entities/usuario'
import { Empresa } from 'app/modulos/empresa/entities/empresa'
import { TestigoReporte } from 'app/modulos/rai/entities/testigo-reporte'
import { Subcontratista } from 'app/modulos/ctr/entities/aliados'

export class Reporte {
  id: number;
  tipo: string;
  nombreEps: string;
  codigoEps: string;
  nombreAfp: string;
  codigoAfp: string;
  nombreArl: string;
  codigoArl: string;
  tipoVinculador: string;
  nombreCiiu: string;
  codigoCiiu: string;
  razonSocial: string;
  identificacionEmpresa:string;
  tipoIdentificacionEmpresa: string;
  direccionEmpresa: string;
  telefonoEmpresa: string;
  telefono2Empresa: string;
  emailEmpleado:string;
  emailEmpresa: string;
  zonaEmpresa: string;
  centrTrabIgualSedePrinc: boolean;
  nombreCentroTrabajo: string;
  codigoCentroTrabajo: string;
  ciiuCentroTrabajo: string;
  codCiiuCentroTrabajo: string;
  nombreCiiuCentroTrabajo:string;
  direccionCentroTrabajo: string;
  telefonoCentroTrabajo: string;
  zonaCentroTrabajo: string;
  tipoVinculacion: string;
  codigoTipoVinculacion: string;
  primerApellidoEmpleado: string;
  segundoApellidoEmpleado: string;
  primerNombreEmpleado: string;
  segundoNombreEmpleado: string;
  tipoIdentificacionEmpleado: string;
  numeroIdentificacionEmpleado: string;
  fechaNacimientoEmpleado: Date;
  generoEmpleado: string;
  direccionEmpleado: string;
  telefonoEmpleado: string;
  telefono2Empleado: string;
  fechaIngresoEmpleado: Date;
  zonaEmpleado: string;
  cargoEmpleado: string;
  ocupacionHabitual: string;
  codigoOcupacionHabitual: string;
  diasLaborHabitual: number;
  mesesLaborHabitual: number;
  salario: number;
  jornadaHabitual: string;
  fechaAccidente: Date;
  horaAccidente: Date;
  numerofurat: string;
  jornadaAccidente: string;
  realizandoLaborHabitual: boolean;
  nombreLaborHabitual: string;
  codigoLaborHabitual: string;
  horaInicioLabor: Date;
  tipoAccidente: string;
  causoMuerte: boolean;
  zonaAccidente: string;
  lugarAccidente: string;
  huboTestigos: boolean;
  descripcion: string;
  sitio: string;
  cualSitio: string;
  tipoLesion: string;
  cualTipoLesion: string;
  parteCuerpo: string;
  agente: string;
  cualAgente: string;
  mecanismo: string;
  cualMecanismo: string;
  ciudadEmpresa: Ciudad;
  ciudadCentroTrabajo: Ciudad;
  ciudadEmpleado: Ciudad;
  ciudadAccidente: Ciudad;
  areaAccidente: Area;
  usuarioReporta: Usuario;
  empresa: Empresa;
  testigoReporteList: TestigoReporte[];
  severidad: string;
  nombresResponsable: string;
  apellidosResponsable: string;
  tipoIdentificacionResponsable: string;
  numeroIdentificacionResponsable: string;
  cargoResponsable: string;
  fechaReporte: Date;
  temporal:string;
  istemporal:boolean | null;
  subcontratista: Subcontratista | null;
}