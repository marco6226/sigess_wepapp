
import { Cie } from 'app/modulos/comun/entities/cie'
import { Empleado } from 'app/modulos/empresa/entities/empleado'
import { CausaAusentismo } from 'app/modulos/aus/entities/causa-ausentismo'
import { Ciudad } from '../../comun/entities/ciudad';

export class ReporteAusentismo {
    id: string;
    fechaElaboracion: Date;
    fechaRadicacion: Date;
    fechaDesde: Date;
    fechaHasta: Date;
    diasAusencia: number;
    horasAusencia: number;
    entidadOtorga: string;
    cie: Cie;
    ciudad: Ciudad;
    empleado: Empleado;
    causaAusentismo: CausaAusentismo;
}
