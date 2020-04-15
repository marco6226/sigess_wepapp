import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'


@Injectable()
export class EnumeracionesService {

  constructor(private httpInt: HttpInt) { }

  findTipoIdentificacion() {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.com_tipoIdentificacion)
        .map(res => res)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => console.log(err)
        )
    });
  }

  findTipoVinculacion() {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.com_tipoVinculacion)
        .map(res => res)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => console.log(err)
        )
    });
  }


  findTipoSede() {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.com_tipoSede)
        .map(res => res)
        .subscribe(
        res => {
          resolve(res);
        }
        ,
        err => console.log(err)
        )
    });
  }

}
