import { Injectable } from '@angular/core';
import { HttpInt } from 'app/httpInt'
import { endPoints } from 'environments/environment'

import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { AnalisisDesviacion } from 'app/modulos/sec/entities/analisis-desviacion'

@Injectable()
export class AnalisisDesviacionService extends ServiceCRUD<AnalisisDesviacion>{

  findByTarea(tareaId: string) {
    return new Promise(resolve => {
      this.httpInt.get(this.end_point + 'tarea/' + tareaId)
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

  getAnalisisTemporal(idAnalisis:number){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${this.end_point}idanalisis/${idAnalisis}`)
        
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
    return "AnalisisDesviacionService";
  }

  sendGestoresEmail(idReporte: number, aliadoID: number, analisisID: number, esNuevo: boolean){
    let body = {
      aliadoID: aliadoID,
      analisisID: analisisID,
      esNuevo: esNuevo
    }

    return new Promise((resolve, reject) => {
      this.httpInt.post(`${this.end_point}emailGestores/${idReporte}`, body)
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

  updateSeguimiento(idAnalisisDesviacion: number, seguimiento: string, observaciones: string){
    let body = {
      seguimiento: seguimiento,
      observaciones: observaciones
    }
    return new Promise((resolve, reject) => {
      this.httpInt.post(`${this.end_point}updateSeguimiento/${idAnalisisDesviacion}`, body)
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

}
