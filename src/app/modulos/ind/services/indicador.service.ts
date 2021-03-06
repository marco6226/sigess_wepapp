import { Injectable } from '@angular/core';

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Indicador } from '../entities/indicador';
import { ParametroIndicador, Kpi } from '../entities/kpi';
import { reject } from 'q';

@Injectable()
export class IndicadorService extends ServiceCRUD<Indicador>{

  actualizarKpi(kpi: Kpi): any {
    let body = JSON.stringify(kpi);
    return new Promise((resolve, reject) => {
      this.httpInt.put(this.end_point + 'kpi/', body)
        .subscribe(
          res => resolve(res),
          err => {
            this.manageError(err);
            reject(err);
          }
        )
    });
  }

  consultarIndicador(param: ParametroIndicador) {
    let strParam = encodeURIComponent(JSON.stringify(param));
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'data/?param=' + strParam)
        .retryWhen(this.retryFunction)
        .map(res => res)
        .subscribe(
          res => resolve(res),
          err => {
            reject(err);
            this.manageError(err)
          }
        )
    });
  }

  getClassName() {
    return "IndicadorService";
  }

}

