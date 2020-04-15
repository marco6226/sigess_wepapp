import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { TipoArea } from 'app/modulos/empresa/entities/tipo-area'

@Injectable()
export class TipoAreaService extends ServiceCRUD<TipoArea> {

  getClassName() : string{
    return "TipoAreaService";
  }

}
