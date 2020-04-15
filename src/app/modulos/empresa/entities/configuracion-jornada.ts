
import { Jornada } from 'app/modulos/empresa/entities/jornada';
import { Empleado } from 'app/modulos/empresa/entities/empleado';

export class ConfiguracionJornada {
  id: string;
  fechaEntradaVigencia: Date;
  empleado: Empleado;
  jornadaList: Jornada[];
}
