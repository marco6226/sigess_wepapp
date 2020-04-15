import { Injectable } from '@angular/core';

import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'

import { Evaluacion } from 'app/modulos/sg/entities/evaluacion'

@Injectable()
export class EvaluacionService extends ServiceCRUD<Evaluacion> {


  findIndicadoresByEmpresa(empresaId: string) {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.EvaluacionService + "indicadores/empresa/" + empresaId)
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

  findDesviaciones(evaluacionId: string) {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.EvaluacionService + "desviaciones/" + evaluacionId)
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
    return "EvaluacionService";
  }

}
