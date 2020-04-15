import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Ipecr } from 'app/modulos/ipr/entities/ipecr'

@Injectable()
export class IpecrService extends ServiceCRUD<Ipecr>{

  getClassName(): string {
    return "IpecrService";
  }

}
