import { Injectable } from '@angular/core';
import { ConfiguracionJornada } from 'app/modulos/empresa/entities/configuracion-jornada'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

@Injectable()
export class ConfiguracionJornadaService extends ServiceCRUD<ConfiguracionJornada>{

  getClassName(): string {
    return "ConfiguracionJornadaService";
  }
}
