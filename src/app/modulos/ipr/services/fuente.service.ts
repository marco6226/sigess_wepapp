import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Fuente } from 'app/modulos/ipr/entities/fuente'

@Injectable()
export class FuenteService extends ServiceCRUD<Fuente>{

  getClassName(): string {
    return "FuenteService";
  }

}
