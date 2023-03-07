import { Injectable } from '@angular/core';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { TipoPeligro } from 'app/modulos/ipr/entities/tipo-peligro'
import { endPoints } from 'environments/environment'

@Injectable({
  providedIn: 'root'}
)
export class TipoPeligroService extends ServiceCRUD<TipoPeligro>{

  getClassName(): string {
    return "TipoPeligroService";
  }

  // getForEmpresa(idEmpresa:number){
  //   return new Promise(resolve => {
  //     this.httpInt.get(endPoints.TipoPeligroService + "empresa/" + idEmpresa)
  //       .map(res => res)
  //       .subscribe(
  //       res => {
  //         resolve(res);
  //       }
  //       ,
  //       err => console.log(err)
  //       )
  //   });
  // }
  getForEmpresa(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.TipoPeligroService}empresaId`)
        .map(res => res)
        .subscribe(
        res => {
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
  getForEmpresa2(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.TipoPeligroService}prueba`)
        .map(res => res)
        .subscribe(
        res => {
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

}
