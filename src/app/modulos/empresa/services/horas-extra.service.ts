import { Injectable } from '@angular/core';
import { HorasExtra } from 'app/modulos/empresa/entities/horas-extra'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

@Injectable()
export class HorasExtraService extends ServiceCRUD<HorasExtra>{

  getClassName(): string {
    return "HorasExtraService";
  }
}
