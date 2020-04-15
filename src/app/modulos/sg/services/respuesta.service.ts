import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Respuesta } from 'app/modulos/sg/entities/respuesta'

@Injectable()
export class RespuestaService extends ServiceCRUD<Respuesta>{

  findAllByEvaluacion(evaluacionId: string) {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.sge_respuesta + "evaluacion/" + evaluacionId)
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

  getClassName() : string{
    return "RespuestaService";
  }


}
