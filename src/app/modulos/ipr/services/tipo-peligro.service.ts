import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { TipoPeligro } from 'app/modulos/ipr/entities/tipo-peligro'

@Injectable()
export class TipoPeligroService extends ServiceCRUD<TipoPeligro>{

  getClassName(): string {
    return "TipoPeligroService";
  }

}
