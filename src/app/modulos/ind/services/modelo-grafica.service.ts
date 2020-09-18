import { Injectable } from '@angular/core';

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { ModeloGrafica } from 'app/modulos/ind/entities/modelo-grafica'

@Injectable()
export class ModeloGraficaService extends ServiceCRUD<ModeloGrafica>{

  findRai<T>(tipo, rangos, empresaId) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorRai/" + tipo + "/" + rangos + "/" + (empresaId == null ? 0 : empresaId))
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

  findInp<T>(areaId, rangos, empresaId) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + areaId + "/" + rangos + "/" + (empresaId == null ? 0 : empresaId))
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

  findInpN<T>(areasId, desde, hasta) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "test/" + areasId + "/" + desde + "/"+ hasta)
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
  
  findInpCobertura<T>(areasId, desde, hasta) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "cobertura/" + areasId + "/" + desde + "/"+ hasta)
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
    return "ModeloGrafica";
  }

}
