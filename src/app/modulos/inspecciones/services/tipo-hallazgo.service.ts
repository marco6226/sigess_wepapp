import { Injectable } from '@angular/core';
import { TipoHallazgo } from '../entities/tipo-hallazgo';
import { ServiceCRUD } from '../../core/services/service-crud.service';


@Injectable()
export class TipoHallazgoService extends ServiceCRUD<TipoHallazgo>{
  
  getClassName(): string {
    return "TipoHallazgoService";
  }


}
