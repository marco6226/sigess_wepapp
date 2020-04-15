import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'
import { Sede } from 'app/modulos/empresa/entities/sede'

@Injectable()
export class SedeService {

  constructor(private httpInt: HttpInt) { }

  findByEmpresa(empresaId: string) {
    return new Promise(resolve => {
      this.httpInt.get(endPoints.sede + "empresa/" + empresaId)
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

  create(sede: Sede) {
    let body = JSON.stringify(sede);

    return new Promise(resolve => {
      this.httpInt.post(endPoints.sede, body)
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

  update(sede: Sede) {
    let body = JSON.stringify(sede);

    return new Promise(resolve => {
      this.httpInt.put(endPoints.sede, body)
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

  delete(sedeId: string) {
    return new Promise(resolve => {
      this.httpInt.delete(endPoints.sede + sedeId)
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
