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
      this.httpInt.get(this.end_point + "indicadorInp/" + "cumplimientoinp/" + areasId + "/" + desde + "/"+ hasta)
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
  findInptotal<T>(areasId, desde, hasta) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "cumplimientoinptotal/" + areasId + "/" + desde + "/"+ hasta)
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
  findAttotal<T>(areasId, desde, hasta) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "cumplimientoattotal/" + areasId + "/" + desde + "/"+ hasta)
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
  findAuctotal<T>(areasId, desde, hasta) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "cumplimientoauctotal/" + areasId + "/" + desde + "/"+ hasta)
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
        .map(res2 => res2)
        .subscribe(
        res2 => {
          resolve(res2);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findInpEfectividad<T>(areasId, desde, hasta) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "efectividad/" + areasId + "/" + desde + "/"+ hasta)
        .map(res2 => res2)
        .subscribe(
        res2 => {
          resolve(res2);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findTipoAt<T>(areasId, desde, hasta) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "tipo/" + areasId + "/" + desde + "/"+ hasta)
        .map(res2 => res2)
        .subscribe(
        res2 => {
          resolve(res2);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findInpEfectividadAt<T>(areasId, desde, hasta) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "efectividadat/" + areasId + "/" + desde + "/"+ hasta)
        .map(res2 => res2)
        .subscribe(
        res2 => {
          resolve(res2);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findInpCoberturaAt<T>(areasId, desde, hasta) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "coberturaat/" + areasId + "/" + desde + "/"+ hasta)
        .map(res2 => res2)
        .subscribe(
        res2 => {
          resolve(res2);
        }
        ,
        err => this.manageError(err)
        )
    });
  }
  findInpEficaciaAuc<T>(areasId, desde, hasta) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "indicadorInp/" + "eficaciaauc/" + areasId + "/" + desde + "/"+ hasta)
        .map(res2 => res2)
        .subscribe(
        res2 => {
          resolve(res2);
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
