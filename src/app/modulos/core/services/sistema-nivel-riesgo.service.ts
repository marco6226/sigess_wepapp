import { Injectable } from '@angular/core';

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { SistemaNivelRiesgo } from 'app/modulos/core/entities/sistema-nivel-riesgo'

@Injectable()
export class SistemaNivelRiesgoService extends ServiceCRUD<SistemaNivelRiesgo>{

  findDefault() {
    return super.find("default");
  }

  getClassName() {
    return 'SistemaNivelRiesgoService';
  }
}
