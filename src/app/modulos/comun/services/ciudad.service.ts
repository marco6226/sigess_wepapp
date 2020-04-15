import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Ciudad } from '../entities/ciudad';

@Injectable()
export class CiudadService extends ServiceCRUD<Ciudad>{

  getClassName() {
    return "CiudadService";
  }

}