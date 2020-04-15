import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Control } from 'app/modulos/ipr/entities/control'

@Injectable()
export class ControlService extends ServiceCRUD<Control>{

  getClassName(): string {
    return "ControlService";
  }

}
