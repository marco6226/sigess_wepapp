import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Peligro } from 'app/modulos/ipr/entities/peligro'

@Injectable()
export class PeligroService extends ServiceCRUD<Peligro>{

  getClassName(): string {
    return "PeligroService";
  }

}
