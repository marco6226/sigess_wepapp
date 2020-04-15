import { Injectable } from '@angular/core';
import { Cargo } from 'app/modulos/empresa/entities/cargo'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

@Injectable()
export class CargoService extends ServiceCRUD<Cargo>{


  getClassName(): string {
    return "CargoService";
  }
}
