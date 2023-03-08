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
}
