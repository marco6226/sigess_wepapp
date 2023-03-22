import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ReporteATView } from 'app/modulos/ind/entities/ReporteATView'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { FilterQuery } from '../../core/entities/filter-query';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ReporteAtService extends ServiceCRUD<ReporteATView>{
  
  // findInpByFilter(filterQuery?: FilterQuery) {
  //   return new Promise(resolve => {
  //     this.httpInt.get(this.end_point + 'inspecciones/?' + this.buildUrlParams(filterQuery))
  //       .map(res => res)
  //       .subscribe(
  //         res => {
  //           resolve(res);
  //         }
  //         ,
  //         err => this.manageError(err)
  //       )
  //   });
  // }
  
  findAllRAT() {
    return new Promise((resolve, reject) => {
        this.httpInt.get(`${endPoints.ReporteAtService}all`)
            .map(res => res)
            .subscribe(
                res => {
                    resolve(res);
                }
                ,
                err => {
                  this.manageError(err);
                  reject(err);
                }
            )
    });
  }

  getAllAt(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.ReporteAtService}listaAt`)
      .map(res => res)
      .subscribe(
        res => {
          resolve(res);
        },
        err => {
          this.manageError(err);
          reject(err);
        }
      );
    });
  }

  getClassName(): string {
    return "ReporteAtService";
  }
}
