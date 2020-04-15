import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Tarjeta } from 'app/modulos/observaciones/entities/tarjeta'

@Injectable()
export class TarjetaService extends ServiceCRUD<Tarjeta>{
  
  getClassName(): string {
    return "TarjetaService";
  }


}
