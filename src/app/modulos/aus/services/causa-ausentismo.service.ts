import { Injectable } from '@angular/core';
import { CausaAusentismo } from 'app/modulos/aus/entities/causa-ausentismo'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

@Injectable()
export class CausaAusentismoService extends ServiceCRUD<CausaAusentismo>{

  getClassName() {
    return "CausaAusentismoService";
  }

}
