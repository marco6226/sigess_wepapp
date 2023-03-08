import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Desviacion } from 'app/modulos/sec/entities/desviacion'
import { FilterQuery } from '../../core/entities/filter-query';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class DesviacionService extends ServiceCRUD<Desviacion>{
  
  consultarConsolidado(desde: Date, hasta: Date): any {
    let params = "?invDesde=" + encodeURIComponent(desde.toUTCString()) + "&invHasta=" + encodeURIComponent(hasta.toUTCString());
    return new Promise((resolve, reject) => {
      let options: any = {
        responseType: 'blob',
        headers: new HttpHeaders()
          .set('Param-Emp', this.httpInt.getSesionService().getParamEmp())
          .set('app-version', this.httpInt.getSesionService().getAppVersion())
          .set('Authorization', this.httpInt.getSesionService().getBearerAuthToken())
      };
      this.httpInt.http.get(this.end_point + "consinv/" + params, options)
        .map(res => res)
        .subscribe(
          res => resolve(res),
          err => {
            reject(err);
            this.manageBlobError(err)
          }
        )
    });
  }

  findInpByFilter(filterQuery?: FilterQuery) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + 'inspecciones/?' + this.buildUrlParams(filterQuery))
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

  getDesviacionTemporal(idDesviacion:number){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${this.end_point}desviacionId/${idDesviacion}`)
        
        .subscribe(
        (res) => {
          resolve(res);
        }
        ,
        err => {
          this.manageError(err);
          reject(err);
          console.log(err)}
        )
    });
  }

  getClassName(): string {
    return "DesviacionService";
  }

}
