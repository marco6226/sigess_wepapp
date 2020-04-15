import { Injectable } from '@angular/core';

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { IndicadorSge } from 'app/modulos/ind/entities/indicador-sge'

@Injectable()
export class IndicadorSgeService extends ServiceCRUD<IndicadorSge>{

  findBySge<T>(id: string, version: number) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + id + "/" + version)
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

  getClassName() {
    return "IndicadorSgeService";
  }

}
