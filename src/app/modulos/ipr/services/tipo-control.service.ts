import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { TipoControl } from 'app/modulos/ipr/entities/tipo-control'

@Injectable()
export class TipoControlService extends ServiceCRUD<TipoControl>{

  getClassName(): string {
    return "TipoControlService";
  }

}
