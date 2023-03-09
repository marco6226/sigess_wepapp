import { Injectable } from '@angular/core';
import { Cargo } from 'app/modulos/empresa/entities/cargo'
import { ServiceCRUD } from 'app/modulos/core/services/service-crud.service'
import { endPoints } from 'environments/environment'

@Injectable()
export class CargoService extends ServiceCRUD<Cargo>{

  findByEmpresa(){
    return new Promise((resolve, reject) => {
      this.httpInt.get(`${endPoints.cargo}empresa`)
        
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
    return "CargoService";
  }
}
