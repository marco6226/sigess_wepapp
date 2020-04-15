import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Efecto } from 'app/modulos/ipr/entities/efecto'

@Injectable()
export class EfectoService extends ServiceCRUD<Efecto>{

  getClassName(): string {
    return "EfectoService";
  }

}
