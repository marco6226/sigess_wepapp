import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Tarea } from 'app/modulos/sec/entities/tarea'

@Injectable()
export class TareaService extends ServiceCRUD<Tarea>{

  reportarCumplimiento(tarea: Tarea) {
    let body = JSON.stringify(tarea);
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + "reportarCumplimiento", body)
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

  reportarVerificacion(tarea: Tarea) {
    let body = JSON.stringify(tarea);
    return new Promise(resolve => {
      this.httpInt.put(this.end_point + "reportarVerificacion", body)
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

  findByUsuario(usuarioId: string) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + 'usuario/' + usuarioId)
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

  findByAnalisis(analisisId: string) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + 'analisis/' + analisisId)
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
    return "TareaService";
  }

}
