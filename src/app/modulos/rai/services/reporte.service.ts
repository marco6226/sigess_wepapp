import { Injectable } from '@angular/core';

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { Reporte } from 'app/modulos/rai/entities/reporte'
import { FilterQuery } from 'app/modulos/core/entities/filter-query';

@Injectable()
export class ReporteService extends ServiceCRUD<Reporte>{

  cargarArchivo(fileToUpload: File, tipoReporte: string) {
    let formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('tipoReporte', tipoReporte);

    return new Promise((resolve, reject) => {
      this.httpInt.postFile(this.end_point + 'cargarArchivo/', formData)
        .map(res => res)
        .subscribe(
          res => resolve(res),
          err => {
            reject(err);
            this.manageError(err);
          }
        )
    });
  }

  inicializarReporte(empleadoId) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + "inicializarReporte/" + empleadoId)
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

  getForEmpresa(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${this.end_point}empresaId`)
        
        .subscribe(
        (res: Reporte[]) => {
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

  getRepWithFilter(filterQuery?: FilterQuery){
    return new Promise((resolve, reject) => {
      this.httpInt.get(this.end_point + 'reportesTemporal/?' + this.buildUrlParams(filterQuery))
      .map(res => res)
      .subscribe(
        res => {
          resolve(res);
        },
        err => {
          this.manageError(err);
          reject(err);
        }
      )
    });
  }

  getReporteAlido(idReporte:number){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${this.end_point}${idReporte}`)
        
        .subscribe(
        (res: Reporte[]) => {
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
    return "ReporteService";
  }

}
