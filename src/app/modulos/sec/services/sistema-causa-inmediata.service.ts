import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { SistemaCausaInmediata } from 'app/modulos/sec/entities/sistema-causa-inmediata'

@Injectable()
export class SistemaCausaInmediataService extends ServiceCRUD<SistemaCausaInmediata>{

  findDefault() {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "seleccionado/")
        .map(res => res)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => this.manageError(err)
        )
    });
  }

  getClassName(): string {
    return "SistemaCausaInmediataService";
  }

}
