import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { PeligroIpecr } from 'app/modulos/ipr/entities/peligro-ipecr'

@Injectable()
export class PeligroIpecrService extends ServiceCRUD<PeligroIpecr>{

  getClassName(): string {
    return "PeligroIpecrService";
  }

}
