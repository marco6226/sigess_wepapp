import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Programacion } from 'app/modulos/inspecciones/entities/programacion'

@Injectable()
export class ProgramacionService extends ServiceCRUD<Programacion>{

  getClassName(): string {
    return "ProgramacionService";
  }


}
