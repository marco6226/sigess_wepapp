import { Injectable } from '@angular/core';
import { Carview } from 'app/modulos/ind/entities/caracterizacion';
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service';
import { endPoints } from 'environments/environment'

@Injectable()
export class CaracterizacionViewService extends ServiceCRUD<Carview>{

    findAllCAR(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.CaracterizacionViewService}all`)
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

  getClassName(): string {
    return "CaracterizacionViewService";
  }
}