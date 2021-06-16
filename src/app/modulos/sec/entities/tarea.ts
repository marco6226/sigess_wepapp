import { AnalisisDesviacion } from 'app/modulos/sec/entities/analisis-desviacion'
import { Area } from 'app/modulos/empresa/entities/area'
import { Usuario } from 'app/modulos/empresa/entities/usuario'
import { Empleado } from 'app/modulos/empresa/entities/empleado';

export class Tarea {
    id: string;
    nombre: string;
    descripcion: string;
    tipoAccion: string;
    jerarquia: string;
    estado: string;
    fechaProyectada: Date;
    fechaRealizacion: Date;
    fechaVerificacion: Date;
    areaResponsable: Area;
    empResponsable: Empleado;
    observacionesRealizacion: string;
    observacionesVerificacion: string;
    usuarioRealiza: Usuario;
    usuarioVerifica: Usuario;
    analisisDesviacionList: AnalisisDesviacion[];
    modulo: string;
    codigo: string;
}
