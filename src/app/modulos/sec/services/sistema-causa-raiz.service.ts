import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { SistemaCausaRaiz } from 'app/modulos/sec/entities/sistema-causa-raiz'

@Injectable()
export class SistemaCausaRaizService extends ServiceCRUD<SistemaCausaRaiz>{

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

  findDefault2(idEmpresa: number){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + `seleccionado2/${idEmpresa}`)
      .map(res => res)
      .subscribe(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      )
    });
  }

  getClassName(): string {
    return "SistemaCausaRaizService";
  }

}
