import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Cie } from 'app/modulos/comun/entities/cie'

@Injectable()
export class CieService extends ServiceCRUD<Cie>{

  getClassName() {
    return "CieService";
  }

}